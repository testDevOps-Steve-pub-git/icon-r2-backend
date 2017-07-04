'use strict'

const errorHandler = require(`${__base}/server/services/error-service`)
const statusCodes = require(`${__base}/server/models/response-status-code`)

/**
 * @function disable unused API endpoints
 * @model {Object} model to hobble
 */
function allowPostOnly (model) {
  ['upsert', 'updateAll', 'prototype.updateAttributes', 'replaceById',
    'replaceOrCreate', 'upsertWithWhere', 'find', 'findById',
    'findOne', 'deleteById', 'confirm', 'count', 'exists',
    'createChangeStream', 'prototype.__count__accessTokens',
    'prototype.__create__accessTokens', 'prototype.__delete__accessTokens',
    'prototype.__destroyById__accessTokens', 'prototype.__findById__accessTokens',
    'prototype.__get__accessTokens', 'prototype.__updateById__accessTokens'
  ].forEach((method) => {
    model.disableRemoteMethodByName(method)
  })
}

function beforeRemote (ctx, next, options) {
  if (!!options.isValid && options.isValid(ctx)) {
    if (options.setData) {
      options.setData(ctx)
    }
    next()
  } else {
    next(errorHandler.IconCustomError('Bad request', {
      decoded: ctx.req.decoded,
      statusCode: statusCodes.BAD_REQUEST,
      processType: options.processType
    }))
  }
}

function afterRemote (ctx, modelInstance, options) {
  // Send back the response code and nothing else
  var status = ctx.res.statusCode
  if (status && status === statusCodes.OK) {
    status = statusCodes.CREATED
  }
  ctx.res.status(status).end()
}

module.exports = (Model, options = {}) => {
  // limit to POST action
  allowPostOnly(Model)

  Model.beforeRemote('create', (ctx, modelInstance, next) => {
    beforeRemote(ctx, next, options)
  })

  Model.afterRemote('create', (ctx, modelInstance, next) => {
    afterRemote(ctx, modelInstance, options)
  })
}
