'use strict'

const errorHandler = require(`${__base}/server/services/error-service`)
const config = require(`${__base}/config`)

module.exports = function (LookupDisease) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupDisease)

  /**
    * Usage: http://gbhu.vcap.me:6002/api/lookup/disease?filter[snomed]=63650001,14189004
    */
  LookupDisease.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.snomed) {
      next(errorHandler.IconError('Invalid request'))
    }

    const snomedArray = ctx.query.snomed.split(',')
    const responseLimit = Math.min(snomedArray.length, config.postgres.lookUp.batchThreshold)

    ctx.query = {
      limit: responseLimit,
      where: {
        snomed: {
          inq: snomedArray
        }
      }
    }
    next()
  })
}
