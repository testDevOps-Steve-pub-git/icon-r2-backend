'use strict'

const config = require(`${__base}/config`)
const errorHandler = require(`${__base}/server/services/error-service`)

module.exports = function (LookupImmunization) {
  require(`${__base}/server/models/lookup/rest-api-select-only`)(LookupImmunization)

  /**
    * Usage: http://localhost:3000/api/lookup/immunization?filter[immun]=ra&filter[lang]=en
    *
    * Usage: http://localhost:3000/api/lookup/immunization?filter[immun]=im&filter[lang]=fr
    */
  LookupImmunization.observe('access', function logQuery (ctx, next) {
    if (!ctx.query.immun || !ctx.query.lang) {
      next(errorHandler.IconError('Invalid request'))
    }

    let condition1, condition2, condition3

    if (ctx.query.lang === 'en') {
      condition1 = { agentLongEn: {like: `${(ctx.query.immun).toLowerCase()}%`} }
      condition2 = { agentShortEn: {like: `${(ctx.query.immun).toLowerCase()}%`} }
      condition3 = { tradeEn: {like: `${(ctx.query.immun).toLowerCase()}%`} }
    }
    if (ctx.query.lang === 'fr') {
      condition1 = { agentLongFr: {like: `${(ctx.query.immun).toLowerCase()}%`} }
      condition2 = { agentShortFr: {like: `${(ctx.query.immun).toLowerCase()}%`} }
      condition3 = { tradeFr: {like: `${(ctx.query.immun).toLowerCase()}%`} }
    }

    ctx.query = {
      fields: {
        agentLongEn: false,
        agentLongFr: false,
        agentShortEn: false,
        agentShortFr: false,
        tradeEn: false,
        tradeFr: false
      },
      limit: config.postgres.lookUp.immunizationLimit,
      where: {
        or: [
          condition1,
          condition2,
          condition3
        ]
      }
    }

    next()
  })
}
