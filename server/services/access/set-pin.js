'use strict'

const debug = require('debug')('access:set-pin')
const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  const requestObject = {
    method: 'POST',
    url: config.url + config.endPoints.setPin,
    headers: {
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    body: {
      'oiid': options.oiid,
      'hcn': options.hcn,
      'email': options.email,
      'pin': options.pin,
      'role': options.role
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  }

  debug(JSON.stringify(requestObject))

  return request(requestObject)
}
