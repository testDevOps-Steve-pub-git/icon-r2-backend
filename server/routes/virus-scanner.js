'use strict'

const virusScanner = require(`${__base}/server/services/http-virus-scanner`)
const config = require(`${__base}/config`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
// const STATUS_CODE = require(`${__base}/server/models/response-status-code`)

module.exports = (req, res, next) => {
  if (!config.clamav.enabled) {
    return next()
  }

  logger.logDebug(PROCESS_TYPE.SUBMISSION.VIRUS_SCAN, 'Scanning upload for viruses')

  virusScanner(req.files[0].buffer, config.clamav)
  .then(() => {
    logger.logDebug(PROCESS_TYPE.SUBMISSION.VIRUS_SCAN, 'Upload scanned and no viruses found')
    next()
  })
  .catch((err) => {
    err.decoded = req.decoded
    err.processType = PROCESS_TYPE.SUBMISSION.VIRUS_SCAN
    err.stack = null
    next(err)
  })
}
