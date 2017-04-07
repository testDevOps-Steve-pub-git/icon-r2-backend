'use strict'
module.exports = Router()

function Router () {
  var crypto = require(`${__base}/server/routes/crypto`)
  var lookup = require(`${__base}/server/routes/lookup`)
  var token = require(`${__base}/server/routes/token`)
  var validateAttachment = require(`${__base}/server/routes/attachment`)
  var virusScanner = require(`${__base}/server/routes/virus-scanner`)
  var yellowcardRouter = require(`${__base}/server/routes/yellowcard`)
  var validateFhir = require(`${__base}/server/routes/validate-fhir`)
  var tracking = require(`${__base}/server/routes/tracking`)
  var pdfGeneration = require(`${__base}/server/routes/pdf-generation`)

  return {
    api: {
      postImmunizationSubmission: [token.authenticateSessionAndSubmissionToken, validateFhir, crypto.encryptRequestBody],
      submissionAttachment: [token.authenticateSessionAndSubmissionToken, validateAttachment, virusScanner, crypto.encryptFileUpload],
      authenticateSessionToken: [token.authenticateSessionToken],
      authenticateSessionAndSubmissionToken: [token.authenticateSessionAndSubmissionToken],
      lookup: [token.authenticateSessionAndSubmissionToken],
      yellowcardlookup: [token.authenticateSessionToken, lookup],
      yellowcardRetrieval: [token.authenticateSessionToken, yellowcardRouter.authenticateRequest, yellowcardRouter.requestFromPhix],
      tracking: [token.authenticateSessionToken, tracking],
      pdfGeneration: [token.authenticateSessionAndSubmissionToken, pdfGeneration]
    }
  }
}
