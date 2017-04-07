'use strict'

var Promise = require('bluebird')

var logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

var decoded

module.exports = (app, objData) => {
  decoded = {
    sessionId: objData.immunSubmission.sessionId,
    submissionId: objData.immunSubmission.transactionId,
    fileAttachmentCount: objData.fileAttachmentCount,
    responseCode: objData.response.statusCode || ''
  }

  return Promise
    .all([
      deleteImmunizationRecord(app, objData),
      deletedFileAttachment(app, objData)
    ])
    .catch((err) => {
      // Do not throw the ERROR as the immunization record is already submitted
      // Throwing error will re-queue the message
      logger.error(PROCESS_TYPE.RABBIT.CONSUMER.PURGE, 'error occured while deleting the data', {
        decoded: decoded,
        stacktrace: JSON.stringify(err.stack) || ''
      })
    })
}

function deleteImmunizationRecord (app, objData) {
  return app.models.ImmunizationSubmission
        .destroyById(objData.immunSubmission.id)
        .then((value) => {
          logger.info(PROCESS_TYPE.RABBIT.CONSUMER.PURGE, 'successfully deleted immunization record', {
            deletedFileAttachmentCount: value.count
          })
        })
        .catch((err) => {
          // Do not throw the ERROR as the immunization record is already submitted
          // Throwing error will re-queue the message
          logger.error(PROCESS_TYPE.RABBIT.CONSUMER.PURGE, 'failed to delete immunization record', {
            decoded: decoded,
            stacktrace: JSON.stringify(err.stack) || ''
          })
        })
}

function deletedFileAttachment (app, objData) {
  return app.models.SubmissionAttachment
        .destroyAll({
          where: {
            transactionId: objData.immunSubmission.transactionId
          }
        })
        .then((value) => {
          logger.info(PROCESS_TYPE.RABBIT.CONSUMER.PURGE, 'successfully deleted immunization file attachments', {
            deletedFileAttachmentCount: value.count
          })
        })
        .catch((err) => {
          // Do not throw the ERROR as the immunization record is already submitted
          // Throwing error will re-queue the message
          logger.error(PROCESS_TYPE.RABBIT.CONSUMER.PURGE, 'failed to delete immunization file attachments', {
            decoded: decoded,
            stacktrace: JSON.stringify(err.stack) || ''
          })
        })
}
