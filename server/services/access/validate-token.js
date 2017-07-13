'use strict'

const debug = require('debug')('access:validate-token')
const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  const requestObject = {
    method: 'POST',
    url: config.url + config.endPoints.validateToken,
    headers: {
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    body: {
      'token': options.token
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  }

  debug(JSON.stringify(requestObject))

  return request(requestObject)
}
