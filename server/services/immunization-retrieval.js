'use strict'

const request = require('request-promise')
const config = require(`${__base}/config.js`).phixEndpoint.retrieval

module.exports = (options) => {
  return request({
    url: config.url + config.queryString(options.oiid),
    headers: {
      'Immunizations_Context': options.context,
      'Submission_Context': `Bearer ${options.token}`,
      'Channel_Context': `Bearer ${config.token}`
    },
    json: true,
    resolveWithFullResponse: true, // not just body
    simple: false // only throw for technical errors (5xx, connection refused, etc..)
  })
}
