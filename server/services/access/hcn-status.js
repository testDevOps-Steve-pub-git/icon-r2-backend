'use strict'

const request = require('request-promise')
const config = require(`${__base}/config.js`).access

module.exports = (options) => {
  return request({
    url: config.url + config.endPoints.hcnStatus + config.queryString(options.oiid),
    headers: {
      'oiid': options.oiid,
      'Submission_Context': `Bearer ${options.sessionToken}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  })
}
