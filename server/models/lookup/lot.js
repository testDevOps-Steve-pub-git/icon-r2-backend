'use strict'

var config = require(`${__base}/config`)
var errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupLot) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupLot)

  /**
    * Usage: http://localhost:3000/api/lookup/lot?filter[number]=c43
    */
  LookupLot.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.number) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      fields: {
        json: false
      },
      where: {
        lotNumber: {
          like: `${ctx.query.number.toUpperCase()}%`
        }
      }
    }
    next()
  })
}
