'use strict'

var errorHandler = require(`${__base}/server/services/error-service`)
var config = require(`${__base}/config`)

module.exports = function (LookupDisease) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupDisease)

  /**
    * Usage: http://gbhu.vcap.me:6002/api/lookup/disease?filter[snomed]=63650001,14189004
    */
  LookupDisease.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.snomed) {
      next(errorHandler.IconError('Invalid request'))
    }

    var snomedArray = ctx.query.snomed.split(',')
    var responseLimit = Math.min(snomedArray.length, config.postgres.lookUp.batchThreshold)

    ctx.query = {
      limit: responseLimit,
      fields: {
        snomed: false,
        friendlyEnName: false,
        friendlyFrName: false,
        yellowCardOrder: false
      },
      where: {
        snomed: {
          inq: snomedArray
        }
      }
    }
    next()
  })
}
