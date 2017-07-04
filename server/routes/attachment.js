'use strict'

const Promise = require('bluebird')
const validator = require(`${__base}/server/services/attachment/validator`)
const config = require(`${__base}/config`)
const processTypes = require(`${__base}/server/models/process-type`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const errorHandler = require(`${__base}/server/services/error-service`)

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
  .then(next)
  .catch(next)
}
