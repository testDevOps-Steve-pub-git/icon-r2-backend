const request = require('request-promise')
const moment = require('moment')
const config = require(`${__base}/config.js`)
const logger = require(`${__base}/server/logger`)
const errorService = require(`${__base}/server/services/error-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const Promise = require('bluebird')

// JSON.parse errors won't call the .catch block
// So handle with try/catch and it's own logging
function jsonParse (data) {
  try {
    return JSON.parse(data)
  } catch (err) {
    logger.error(`tracking-service#jsonParse failed with ${err.message} - ${data}`)
    return {}
  }
}

/*
 *  getLogs()
 *
 *  This function takes a query object and completes the query to elasticsearch. There is a
 *  timeout set to ensure that the logs are indexed in elasticsearch.
 *
 *  @param  {Object}    queryObject   - Represents the object used to query for specific data from elasticsearch
 *
 *  @returm {[Object]}                - Array of objects containing all resultant logs from the query
 */
function getLogs (queryObject) {
  return new Promise((resolve, reject) => {
    // Fire request for previous logs
    // Wait according to configuration to ensure audit was indexed
    setTimeout(() => {
      request.post({
        uri: `${config.elasticSearch.url}*/_search`,
        'content-type': 'application/json',
        body: JSON.stringify(queryObject)
      })
    .then(jsonParse)
    .then((response) => {
      if (response.hits && response.hits.hits) {
        resolve(response.hits.hits)
      } else {
        resolve([])
      }
    })
    .catch((err) => {
      throw errorService.IconCustomError(err.message, PROCESS_TYPE.AUDIT_UPDATE)
    })
    }, config.tracking.updateTimeService.delay)
  })
}

/*
 *  getRecentLogs()
 *
 *  This function retrieves the 2 most previous logs from elasticsearch for a given sessionId
 *
 *  @param  {String}   sessionId     - Represents which session we want to query logs for
 *  @return {Object}                 - JSON response containing logs that were requested
 */
function getRecentLogs (sessionId, timestamp) {
  // Prepare object to grab previous two logs from elasticsearch
  const queryObject = {
    query: {
      bool: {
        must: {
          term: {
            'fields.sessionId': sessionId
          }
        },
        filter: {
          range: {
            'fields.timestamp': {
              lte: timestamp
            }
          }
        },
        must_not: {
          missing: {
            field: 'fields.transitionPage',
            existence: true,
            null_value: true
          }
        }
      }
    },
    sort: {
      'fields.timestamp': {
        order: 'desc'
      }
    },
    size: 2
  }

  return getLogs(queryObject)
}

/*
 *  getSessionLogs()
 *
 *  This function takes a sessionId and returns all logs relating to that session
 *
 *  @param  {String}  sessionId   - Represents the session of the user
 */
function getSessionLogs (sessionId) {
  // Prepare object to grab previous two logs from elasticsearch
  const queryObject = {
    query: {
      bool: {
        must: {
          term: {
            'fields.sessionId': sessionId
          }
        },
        must_not: {
          missing: {
            field: 'fields.transitionPage',
            existence: true,
            null_value: true
          }
        }
      }
    },
    sort: {
      'fields.timestamp': {
        order: 'desc'
      }
    }
  }
  return getLogs(queryObject)
}

/*
 *  updateLogDuration()
 *
 *  This function is used to update a specific audit log with the amount of time spent on that page.
 *  It pull the two most recent logs from elasticsearch according to sessionId, calculate the time
 *  between these logs, and updates the second last log with the time calculated.
 *
 *  @param  {String}   id        - Reperesents the id of the log to update
 *  @param  {String}   index     - Represents the index name of the log to update
 *  @param  {Number}   duration  - The time calculated for time spent on previous page
 */
function updateLogDuration (id, index, duration) {
  // Construct query information
  const queryObject = {
    'doc': {
      'fields': {
        'duration': duration
      }
    }
  }
  const body = {
    uri: `${config.elasticSearch.url}${index}/${config.tracking.updateTimeService.typeToUpdate}/${id}/_update`,
    'content-type': 'application/json',
    body: JSON.stringify(queryObject)
  }
  // Make update request to elasticsearch
  request.post(body)
  .then((response) => {
    logger.info(`Updated log ${jsonParse(response)._id} with duration`)
  })
  .catch((error) => {
    throw errorService.IconCustomError(error.message, PROCESS_TYPE.AUDIT_UPDATE)
  })
}

/*
 *  updateComponentTime()
 *
 *  This function takes a session id as a parameter and uses helper functions updateLogDuration()
 *  and getRecentLogs() to construct queries in order to pull the two most recent logs for the
 *  specified sessionId, and updates the second most with duration equal to the difference
 *  between the timestamps.
 *
 *  @param {String}   sessionId   - Represents the session to update component duration for
 *  @param {String}   timestamp   - Represents the timestamp of the most recently accessed page
 */
function updateComponentTime (sessionId, timestamp) {
  if (config.tracking.updateTimeService.enabled && sessionId && timestamp) {
    return getRecentLogs(sessionId, timestamp)
    .then((logs) => {
      if (logs.length === 2) {
        const currentPage = logs[0]
        const prevPage = logs[1]
        const duration = moment(currentPage._source.fields.timestamp).diff(prevPage._source.fields.timestamp, 'seconds')
        updateLogDuration(prevPage._id, prevPage._index, duration)
      }
    })
    .catch((error) => {
      throw errorService.IconCustomError(error.message, PROCESS_TYPE.AUDIT_UPDATE)
    })
  }
}

/*
 *  updateSessionTime()
 *
 *  This function is triggered when the user accessed the confirmation page. It
 *  grabs all the logs for that users sessions and compares the most recently
 *  accessed page (confirmation) and the page accessed first by the user (welcome).
 *
 *  @param {String}   sessionId   - Represents the session to update component duration for
 *  @param {String}   timestamp   - Represents the timestamp of the confirmation page
 */
function updateSessionTime (sessionId, timestamp) {
  if (config.tracking.updateTimeService.enabled && sessionId && timestamp) {
    return getSessionLogs(sessionId)
    .then((logs) => {
      if (logs.length > 1) {
        // First page accessed in this session
        const welcomePage = logs[logs.length - 1]
        const confirmationPage = logs[0]
        const duration = moment(confirmationPage._source.fields.timestamp).diff(welcomePage._source.fields.timestamp, 'seconds')
        updateLogDuration(confirmationPage._id, confirmationPage._index, duration)
      }
    })
    .catch((error) => {
      throw errorService.IconCustomError(error.message, PROCESS_TYPE.AUDIT_UPDATE)
    })
  }
}

module.exports = {
  updateComponentTime: updateComponentTime,
  updateSessionTime: updateSessionTime
}
