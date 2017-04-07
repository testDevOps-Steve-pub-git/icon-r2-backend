'use strict'

const fhir = require(`${__base}/server/services/fhir-validator`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

module.exports = (req, res, next) => {
  try {
    logger.logDebug(PROCESS_TYPE.SUBMISSION.FHIR, 'Validating submission fhir message')
    let outcome = fhir.validate(req.body, req.decoded.submissionId)
    if (outcome.isValid) {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.FHIR, 'Submission fhir message is valid')
      next()
    } else {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.FHIR, 'Submission fhir message is invalid')
      res.status(statusCodes.UNPROCESSABLE_ENTITY)
      .json(outcome.errors)
      .end()
    }
  } catch (err) {
    err.statusCode = statusCodes.INTERNAL_SERVER_ERROR
    next(err)
  }
}
