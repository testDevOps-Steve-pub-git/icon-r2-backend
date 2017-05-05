'use strict'

const logger = require(`${__base}/server/services/logger-service`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const errorHandler = require(`${__base}/server/services/error-service`)

module.exports = (options) => {
  return (err, req, res, next) => {
    try {
      if (err instanceof Error) {
        err = errorHandler.IconError(err)
        err.processType = PROCESS_TYPE.UNKNOWN_PROCESS_TYPE
      }

      if (!err.logged) {
        logger.logIconError(err)
      }

      res.status(err.statusCode || statusCodes.INTERNAL_SERVER_ERROR).end()
    } catch (error) {
      next(error)
    }
  }
}
