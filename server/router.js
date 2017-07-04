'use strict'

const crypto = require(`${__base}/server/routes/crypto`)
const token = require(`${__base}/server/routes/token`)
const validateAttachment = require(`${__base}/server/routes/attachment`)
const virusScanner = require(`${__base}/server/routes/virus-scanner`)
const validateFhir = require(`${__base}/server/routes/validate-fhir`)
const tracking = require(`${__base}/server/routes/tracking`)
const pdfGeneration = require(`${__base}/server/routes/pdf-generation`)
const immunizationRetrieval = require(`${__base}/server/routes/immunization-retrieval`)
const dhirRouter = require(`${__base}/server/routes/dhir-router`)
const accessRoutes = require(`${__base}/server/router/access`)

module.exports = () => {
  return {
    api: {
      postImmunizationSubmission: [token.authenticateSessionAndSubmissionToken, validateFhir, crypto.encryptRequestBody],
      submissionAttachment: [token.authenticateSessionAndSubmissionToken, validateAttachment, virusScanner, crypto.encryptFileUpload],
      authenticateSessionToken: [token.authenticateSessionToken],
      authenticateSessionAndSubmissionToken: [token.authenticateSessionAndSubmissionToken],
      lookup: [token.authenticateSessionAndSubmissionToken],
      tracking: [token.authenticateSessionAndSubmissionToken, tracking],
      pdfGeneration: [token.authenticateSessionAndSubmissionToken, pdfGeneration],
      immunizationRetrieval: [token.authenticateSessionToken, immunizationRetrieval, dhirRouter],
      access: accessRoutes
    }
  }
}
