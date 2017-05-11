'use strict'

const config = require(`${__base}/config`)
const errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupCity) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupCity)

  /**
    * Usage: http://localhost:3000/api/lookup/city?filter[city]=ham
    */
  LookupCity.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.city) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      where: {
        city: {
          regexp: new RegExp(`^${ctx.query.city}`, 'i')
        }
      }
    }
    next()
  })
}
