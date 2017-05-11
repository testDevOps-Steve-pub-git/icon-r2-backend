'use strict'

const cipher = require(`${__base}/server/services/crypto`)
const errorHandler = require(`${__base}/server/services/error-service`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const processTypes = require(`${__base}/server/models/process-type`)
const config = require(`${__base}/config`)

/*
 * Encrypt the files[0] buffer
 */

function isValidFileUpload (req) {
  return req && req.files && req.files[0] && req.files[0].buffer
}

function isValidRequestBody (req) {
  return req && req.body
}

function encryptRequestBody (req, res, next) {
  const errorOptions = {
    decoded: req.decoded,
    statusCode: statusCodes.BAD_REQUEST,
    processType: processTypes.ICON
  }

  if (!config.crypto.enabled) {
    return next()
  }

  if (!isValidRequestBody(req)) {
    return next(errorHandler.IconCustomError('No request body', errorOptions))
  }

  cipher.encrypt(Buffer.from(JSON.stringify(req.body)), config.crypto)
  .then((buffer) => {
    req.encryptedBody = buffer
  })
  .then(next)
  .catch((err) => {
    throw errorHandler.IconCustomError(err, errorOptions)
  })
  .catch(next)
}

function encryptFileUpload (req, res, next) {
  const errorOptions = {
    decoded: req.decoded,
    statusCode: statusCodes.BAD_REQUEST,
    processType: processTypes.FILE_UPLOAD
  }

  if (!config.crypto.enabled) {
    return next()
  }

  if (!isValidFileUpload(req)) {
    return next(errorHandler.IconCustomError('No file', errorOptions))
  }

  cipher.encrypt(req.files[0].buffer, config.crypto)
  .then((buffer) => {
    req.files[0].buffer = buffer
  })
  .then(next)
  .catch((err) => {
    throw errorHandler.IconCustomError(err, errorOptions)
  })
  .catch(next)
}

module.exports = {
  encryptFileUpload: encryptFileUpload,
  encryptRequestBody: encryptRequestBody
}
