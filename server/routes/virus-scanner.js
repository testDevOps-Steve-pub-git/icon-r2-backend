'use strict'

const virusScanner = require(`${__base}/server/services/virus-scanner`)
const config = require(`${__base}/config`)
const errorHandler = require(`${__base}/server/services/error-service`)
const processTypes = require(`${__base}/server/models/process-type`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

function isTimeout (err) {
  return err.name === 'TimeoutError'
}

function onFailure (err, req) {
  if (isTimeout(err)) {
    err = errorHandler.IconCustomError('Timeout Error', {
      statusCode: statusCodes.SERVICE_UNAVAILABLE,
      decoded: req.decoded,
      processType: processTypes.FILE_UPLOAD
    })
  }
  throw err
}

module.exports = (req, res, next) => {
  if (!config.clamav.enabled) {
    return next()
  }

  logger.logDebug(PROCESS_TYPE.SUBMISSION.VIRUS_SCAN, 'Scanning upload for viruses')

  virusScanner(req.files[0].buffer, config.clamav)
  .timeout(config.clamav.timeout)
  .then(next)
  .catch((err) => { onFailure(err, req) })
  .catch(next)
}
