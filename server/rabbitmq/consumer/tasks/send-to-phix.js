'use strict'

var requestPromise = require('request-promise')

var logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const LOG_LEVELS = require(`${__base}/server/models/log-level`)

module.exports = sendToPhix

function prepareOptionObject (immunSubmission, immunObject, submissionConfig) {
  return {
    method: 'POST',
    uri: submissionConfig.url,
    headers: {
      'Channel_Context': 'Bearer ' + submissionConfig.token, // PHIX Endpoint token
      'Submission_Context': 'Bearer ' + immunSubmission.transactionToken, // ICON Transaction or Submission token
      'Bypass_Validation': (immunSubmission.failedValidation === true)
    },
    body: immunObject,
    json: true, // Automatically stringifies the body to JSON
    resolveWithFullResponse: true
  }
}

function sendToPhix ([immunSubmission, immunObject, submissionConfig, fileAttachmentCount]) {
  return requestPromise(prepareOptionObject(immunSubmission, immunObject, submissionConfig))
        .then((response) => {
          logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.CONSUMER.PHIX, response.body, {
            decoded: {
              sessionId: immunSubmission.sessionId,
              submissionId: immunSubmission.transactionId,
              fileAttachmentCount: fileAttachmentCount
            },
            statusCode: response.statusCode
          })

          return {
            response: response,
            immunSubmission: immunSubmission,
            fileAttachmentCount: fileAttachmentCount
          }
        })
        .catch((err) => {
          // Error received when sending to PHIX, throw error to task.js where it is handled
          logger.log(LOG_LEVELS.ERROR, PROCESS_TYPE.RABBIT.CONSUMER.PHIX, `Send to Phix failed: ${err.message}`, {})
          throw err
        })
}
