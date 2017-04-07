'use strict'

var config = require(`${__base}/config`)
var errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupTrade) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupTrade)

  /**
    * Usage: http://localhost:3000/api/lookup/trade?filter[snomed]=7481000087104
    */
  LookupTrade.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.snomed) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      fields: {
        snomed: false,
        friendlyEnName: false,
        friendlyFrName: false,
        manufacturer: false,
        ontarioStartYear: false,
        ontarioFinishYear: false,
        prevalenceIndex: false,
        panoramaName: false
      },
      where: {
        snomed: ctx.query.snomed
      }
    }
    next()
  })
}
