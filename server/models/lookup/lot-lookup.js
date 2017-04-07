'use strict'

var config = require(`${__base}/config`)
var errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupLots) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupLots)

  /**
    * Usage: http://localhost:3000/api/lookup/lots?filter[snomed]=3526007
    */
  LookupLots.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.snomed) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      where: {
        snomed: ctx.query.snomed
      }
    }
    next()
  })
}
