'use strict'

const debug = require('debug')('access:reset')
const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  const requestObject = {
    method: 'POST',
    url: config.url + config.endPoints.resetAccess,
    headers: {
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    body: {
      'oiid': options.oiid,
      'email': options.email,
      'lang': options.lang,
      'callbackUrl': options.callbackUrl,
      'phuId': options.phuId
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  }

  debug(JSON.stringify(requestObject))

  return request(requestObject)
}
