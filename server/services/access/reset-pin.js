'use strict'

const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  return request({
    method: 'POST',
    url: config.url + config.endPoints.resetPin,
    headers: {
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    body: {
      'oiid': options.oiid,
      'token': options.token,
      'role': options.role,
      'pin': options.pin
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  })
}
