var request = require('request-promise')
var moment = require('moment')
var config = require(`${__base}/config.js`)
var logger = require(`${__base}/server/logger`)
var errorService = require(`${__base}/server/services/error-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

/*
 *  getRecentLogs()
 *
 *  This function retrieves the 2 most previous logs from elasticsearch for a given sessionId
 *
 *  @param  {String}   sessionId     - Represents which session we want to query logs for
 *  @return {Object}                 - JSON response containing logs that were requested
 */
function getRecentLogs (sessionId, timestamp) {
  return new Promise((resolve, reject) => {
    // Prepare object to grab previous two logs from elasticsearch
    var queryObject = {
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

    // Fire request for previous logs
    // Wait according to configuration to ensure audit was indexed
    setTimeout(() => {
      request.post({
        uri: `${config.elasticSearch.url}*/_search`,
        'content-type': 'application/json',
        body: JSON.stringify(queryObject)
      })
      .then((response) => {
        response = JSON.parse(response)
        if (response.hits && response.hits.hits) {
          resolve(response.hits.hits)
        }
      })
      .catch((err) => {
        throw errorService.IconCustomError(err.message, PROCESS_TYPE.AUDIT_UPDATE)
      })
    }, config.elasticSearch.updateTimeService.delay)
  })
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
  var queryObject = {
    'doc': {
      'fields': {
        'duration': duration
      }
    }
  }

  // Make update request to elasticsearch
  request.post({
    uri: `${config.elasticSearch.url}${index}/${config.elasticSearch.updateTimeService.typeToUpdate}/${id}/_update`,
    'content-type': 'application/json',
    body: JSON.stringify(queryObject)
  })
  .then((response) => {
    logger.info(`Updated log ${JSON.parse(response)._id} with time spent on page`)
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
 */
function updateComponentTime (sessionId, timestamp) {
  if (config.elasticSearch.updateTimeService.enabled && sessionId && timestamp) {
    getRecentLogs(sessionId, timestamp)
    .then((logs) => {
      if (logs.length === 2) {
        var currentPage = logs[0]
        var prevPage = logs[1]
        var duration = moment(currentPage._source.fields.timestamp).diff(prevPage._source.fields.timestamp, 'seconds')
        updateLogDuration(prevPage._id, prevPage._index, duration)
      }
    })
    .catch((error) => {
      throw errorService.IconCustomError(error.message, PROCESS_TYPE.AUDIT_UPDATE)
    })
  }
}

module.exports = {
  updateComponentTime: updateComponentTime
}
