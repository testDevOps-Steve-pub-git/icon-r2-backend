'use strict'

const config = require(`${__base}/config`)
const errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupSchool) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupSchool)

  /**
    * Usage: http://localhost:3000/api/lookup/school?filter[name]=playh
    */
  LookupSchool.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.name) {
      next(errorHandler.IconError('Invalid request'))
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      where: {
        name: {
          regexp: new RegExp(`.*${ctx.query.name}.*`, 'i')
        }
      }
    }
    next()
  })
}
