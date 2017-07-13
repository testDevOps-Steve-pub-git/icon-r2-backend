'use strict'

const debug = require('debug')('access:pin-status')
const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  const requestObject = {
    url: config.url + config.endPoints.pinStatus + config.queryString(options.oiid),
    headers: {
      'oiid': options.oiid,
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  }

  debug(JSON.stringify(requestObject))

  return request(requestObject)
}
