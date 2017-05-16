'use strict'

const Promise = require('bluebird')
const pdfService = require(`${__base}/server/services/pdf-service`)
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const STATUS_CODE = require(`${__base}/server/models/response-status-code`)
const errorService = require(`${__base}/server/services/error-service`)

/**
 *  Usage         - Request body must contain a 'content' field which contains the
 *                  formatted data that the PDF will be generated from
 *
 *  (for documentation on content consult: https://github.com/bpampuch/pdfmake)
 */
module.exports = (req, res) => {
  // Log the request for PDF generation
  logger.info({
    processType: PROCESS_TYPE.PDF_GENERATION,
    message: 'Request for PDF generation'
  })

  return Promise.try(() => {
    // Ensure there is a body.content present to generate the PDF
    if (!req.body || !req.body.content) {
      throw errorService.IconError('Content required in request body to generate PDF. Documentation here: https://github.com/bpampuch/pdfmake')
    } else {
      // Generate PDF
      const pdf = pdfService.generatePdf(req.body)
      pdf.pipe(res)
      pdf.end()
    }
  })
  .catch((err) => {
    // Request doesn't have a piece of information, log error and end with bad request
    logger.info({
      processType: PROCESS_TYPE.PDF_GENERATION,
      message: err.message
    })
    res.status(STATUS_CODE.BAD_REQUEST)
    res.end()
  })
}
