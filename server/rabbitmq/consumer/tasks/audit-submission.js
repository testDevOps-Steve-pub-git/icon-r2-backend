'use strict'

const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

/*
 *  This function is used to log ImmunizationSubmission data for auditing purposes
 */
module.exports = (objData) => {
  const decoded = {
    sessionId: objData.immunSubmission.sessionId,
    submissionId: objData.immunSubmission.transactionId,
    fileAttachmentCount: objData.fileAttachmentCount,
    responseCode: objData.response.statusCode || ''
  }

  const metaObject = {
    attemptHistory: objData.immunSubmission.attemptHistory
  }

  // Log informatin to console and audit db
  logger.auditLog(PROCESS_TYPE.SUBMISSION.TASKS, decoded.responseCode, null, decoded, metaObject)

  // Return object data to be used to delete record in table
  return objData
}
