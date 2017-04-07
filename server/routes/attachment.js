'use strict'

var Promise = require('bluebird')
var validator = require(`${__base}/server/services/attachment/validator`)
var config = require(`${__base}/config`)
var processTypes = require(`${__base}/server/models/process-type`)
var statusCodes = require(`${__base}/server/models/response-status-code`)
var errorHandler = require(`${__base}/server/services/error-service`)

function isValid (req) {
  return !!(req &&
    req.files &&
    req.files[0] &&
    req.files[0].buffer &&
    req.decoded &&
    req.decoded.txId &&
    req.app)
}

module.exports = (req, res, next) => {
  let errorOptions = {
    processType: processTypes.ICON,
    decoded: req.decoded
  }

  Promise.try(() => {
    if (!isValid(req)) {
      throw errorHandler.IconCustomError('Bad request', Object.assign(errorOptions, {statusCode: statusCodes.BAD_REQUEST}))
    }

    if (!validator.validSize(req.files[0], config.attachment)) {
      throw errorHandler.IconCustomWarning('File size exceeded', Object.assign(errorOptions, {statusCode: statusCodes.PAYLOAD_TOO_LARGE}))
    }

    if (!validator.validType(req.files[0], config.attachment)) {
      throw errorHandler.IconCustomWarning('Invalid mime type', Object.assign(errorOptions, {statusCode: statusCodes.UNSUPPORTED_MEDIA_TYPE}))
    }
  })
  .then(() => {
    return validator.validLimit(req.app, req.decoded.txId, config.attachment)
  })
  .then((valid) => {
    if (!valid) {
      throw errorHandler.IconCustomWarning('Maximum files uploaded', Object.assign(errorOptions, {statusCode: statusCodes.CONFLICT}))
    }
  })
  .then(next)
  .catch(next)
}
