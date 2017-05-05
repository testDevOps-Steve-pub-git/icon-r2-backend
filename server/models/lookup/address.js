'use strict'

const config = require(`${__base}/config`)
const errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupAddress) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupAddress)

  /**
    * Usage: http://localhost:3000/api/lookup/address?filter[postalCode]=l8n
    */
  LookupAddress.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.postalCode) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      where: {
        postalCode: {
          like: `${ctx.query.postalCode.toUpperCase()}%`
        }
      }
    }
    next()
  })
}
