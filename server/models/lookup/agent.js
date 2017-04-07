'use strict'

var config = require(`${__base}/config`)
var errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupAgent) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupAgent)

  /**
    * Usage: http://localhost:3000/api/lookup/agent?filter[immun]=ra&filter[lang]=fr
    */
  LookupAgent.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.immun || !ctx.query.lang) {
      next(errorHandler.IconError('Invalid request'))
    }

    var condition1, condition2

    if (ctx.query.lang === 'en') {
      condition1 = { longEnName: { regexp: new RegExp(`.*${ctx.query.immun}.*`, 'i') } }
      condition2 = { shortEnName: { regexp: new RegExp(`.*${ctx.query.immun}.*`, 'i') } }
    }
    if (ctx.query.lang === 'fr') {
      condition1 = { longFrName: { regexp: new RegExp(`.*${ctx.query.immun}.*`, 'i') } }
      condition2 = { shortFrName: { regexp: new RegExp(`.*${ctx.query.immun}.*`, 'i') } }
    }

    ctx.query = {
      limit: config.postgres.lookUp.maxRow,
      fields: {
        snomed: false,
        shortEnName: false,
        longEnName: false,
        longFrName: false,
        shortFrName: false,
        isUserView: false,
        prevalenceIndex: false,
        ontarioStartYear: false,
        ontarioFinishYear: false
      },
      where: {
        or: [
          condition1,
          condition2
        ]
      }
    }
    next()
  })
}
