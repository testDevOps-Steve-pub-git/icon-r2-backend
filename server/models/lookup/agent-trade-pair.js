'use strict'

const errorHandler = require(`${__base}/server/services/error-service`)
const config = require(`${__base}/config`)

module.exports = function (LookupAgentAndTrade) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupAgentAndTrade)

  /**
    * Usage: http://gbhu.vcap.me:6002/api/lookup/agent-trade?filter[snomed]=125690004,6921000087107
    */
  LookupAgentAndTrade.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.snomed) {
      next(errorHandler.IconError('Invalid request'))
    }

    const snomedArray = ctx.query.snomed.split(',')
    const lookupLimit = Math.min(snomedArray.length, config.postgres.lookUp.batchThreshold)

    ctx.query = {
      fields: {
        snomed: false
      },
      limit: lookupLimit,
      where: {
        snomed: {
          inq: snomedArray
        }
      }
    }
    next()
  })
}
