'use strict'
module.exports = Router()

function Router () {
  const crypto = require(`${__base}/server/routes/crypto`)
  const lookup = require(`${__base}/server/routes/lookup`)
  const token = require(`${__base}/server/routes/token`)
  const validateAttachment = require(`${__base}/server/routes/attachment`)
  const virusScanner = require(`${__base}/server/routes/virus-scanner`)
  const yellowcardRouter = require(`${__base}/server/routes/yellowcard`)
  const validateFhir = require(`${__base}/server/routes/validate-fhir`)
  const tracking = require(`${__base}/server/routes/tracking`)
  const pdfGeneration = require(`${__base}/server/routes/pdf-generation`)

  return {
    api: {
      postImmunizationSubmission: [token.authenticateSessionAndSubmissionToken, validateFhir, crypto.encryptRequestBody],
      submissionAttachment: [token.authenticateSessionAndSubmissionToken, validateAttachment, virusScanner, crypto.encryptFileUpload],
      authenticateSessionToken: [token.authenticateSessionToken],
      authenticateSessionAndSubmissionToken: [token.authenticateSessionAndSubmissionToken],
      lookup: [token.authenticateSessionAndSubmissionToken],
      yellowcardlookup: [token.authenticateSessionToken, lookup],
      yellowcardRetrieval: [token.authenticateSessionToken, yellowcardRouter.authenticateRequest, yellowcardRouter.requestFromPhix],
      tracking: [token.authenticateSessionAndSubmissionToken, tracking],
      pdfGeneration: [token.authenticateSessionAndSubmissionToken, pdfGeneration]
    }
  }
}
