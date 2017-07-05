'use strict'

const requestPromise = require('request-promise')
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

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
          logger.info(response.body, {
            processType: PROCESS_TYPE.RABBIT.CONSUMER.PHIX,
            statusCode: response.statusCode,
            decoded: {
              sessionId: immunSubmission.sessionId,
              submissionId: immunSubmission.transactionId,
              fileAttachmentCount: fileAttachmentCount
            }
          })

          return {
            response: response,
            immunSubmission: immunSubmission,
            fileAttachmentCount: fileAttachmentCount
          }
        })
        .catch({name: 'StatusCodeError'}, (err) => {
          // Error received when sending to PHIX, throw error to task.js where it is handled
          err.result = err.statusCode
          throw err
        })
        .catch({name: 'RequestError'}, (err) => {
          // Error received when sending to PHIX, throw error to task.js where it is handled
          err.result = err.error.code
          throw err
        })
        .catch((err) => {
          err.result = err.result || 'UNKNOWN'
          logger.error(`Send to Phix failed: ${err.message}`, { processType: PROCESS_TYPE.RABBIT.CONSUMER.PHIX })
          throw err
        })
}
