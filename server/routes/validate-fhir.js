'use strict'

const fhir = require(`${__base}/server/services/fhir-validator`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

module.exports = (req, res, next) => {
  try {
    logger.debug('Validating submission fhir message', { processType: PROCESS_TYPE.SUBMISSION.FHIR })
    const outcome = fhir.validate(req.body, req.decoded.submissionId)
    if (outcome.isValid) {
      logger.debug('Submission fhir message is valid', { processType: PROCESS_TYPE.SUBMISSION.FHIR })
      next()
    } else {
      logger.debug('Submission fhir message is invalid', { processType: PROCESS_TYPE.SUBMISSION.FHIR })
      res.status(statusCodes.UNPROCESSABLE_ENTITY)
      .json(outcome.errors)
      .end()
    }
  } catch (err) {
    err.statusCode = statusCodes.INTERNAL_SERVER_ERROR
    next(err)
  }
}
