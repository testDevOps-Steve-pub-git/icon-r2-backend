'use strict'

const Promise = require('bluebird')
const getDecryptedFiles = require(`${__base}/server/rabbitmq/consumer/tasks/get-decrypted-files`)
const sendToPhix = require(`${__base}/server/rabbitmq/consumer/tasks/send-to-phix`)
const deleteData = require(`${__base}/server/rabbitmq/consumer/tasks/delete-data`)
const auditSubmission = require(`${__base}/server/rabbitmq/consumer/tasks/audit-submission`)
const zip = require(`${__base}/server/rabbitmq/consumer/tasks/zip`)
const app = require(`${__base}/server/server`)
const cipher = require(`${__base}/server/services/crypto`)
const config = require(`${__base}/config`)
const logger = require(`${__base}/server/logger`)
const updateSubmission = require(`${__base}/server/rabbitmq/consumer/tasks/update-submission`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

/**
 * @module task
 */
module.exports = task()

function task () {
  function getZipFile (transactionId) {
    return getDecryptedFiles(app, transactionId, config.crypto)
           .then(zip)
  }

  function appendZipToFhir (immunObject, zipBase64) {
    var zipContent = {
      'contentAttachment': {
        'contentType': 'application/zip',
        'data': zipBase64
      }
    }
    immunObject.payload.push(zipContent)
    return immunObject
  }

  function getDataAndFiles (immunSubmission) {
    return Promise.all([
      immunSubmission,
      getZipFile(immunSubmission.transactionId),
      cipher.decrypt(immunSubmission.immunObject, config.crypto)
    ])
  }

  function prepareObjectForRequest ([immunSubmission, [zipFile, fileAttachmentCount], immunObject]) {
    immunObject = JSON.parse(immunObject.toString())

    if (zipFile) {
      var zipBase64 = zipFile.toString('base64')
      immunObject = appendZipToFhir(immunObject, zipBase64)
    }

    return [immunSubmission, immunObject, config.phixEndpoint.submission, fileAttachmentCount]
  }

  function startTask (message) {
    var immunizationModel
    var updateSuccesful
    return app.models.ImmunizationSubmission.findById(message.json.id)
          .then((immunizationSubmission) => {
            immunizationModel = immunizationSubmission
            return getDataAndFiles(immunizationSubmission)
          })
          .then(prepareObjectForRequest)
          .then(sendToPhix)
          .then((objData) => auditSubmission(objData))
          .catch((err) => {
            // Check if error was due to PHIX, or otherwise, do not logged failed attempt if not PHIX
            if (!err.statusCode) {
              logger.error(PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, err.message)
              throw err
            }
            // Error was hit when sending to PHIX
            // Reconfigure submission options if status code matches one of the blacklisted codes
            return updateSubmission(immunizationModel, err.statusCode, config.phixEndpoint.repostCodes.includes(err.statusCode))
            .then(() => {
              // Task was updated succesfully in DB, throw error so that rabbitmq will requeue the task
              updateSuccesful = true
              throw err
            })
            .catch((err) => {
              // Error updating record in the database, requeue and log error
              if (!updateSuccesful) {
                logger.error(PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'There was an error updating the record')
              }
              throw err
            })
          })
          .then((objData) => deleteData(app, objData))
  }

  return {
    startTask: startTask
  }
}
