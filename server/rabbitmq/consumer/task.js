'use strict'

const Promise = require('bluebird')
const getDecryptedFiles = require(`${__base}/server/rabbitmq/consumer/tasks/get-decrypted-files`)
const sendToPhix = require(`${__base}/server/rabbitmq/consumer/tasks/send-to-phix`)
const deleteData = require(`${__base}/server/rabbitmq/consumer/tasks/delete-data`)
const auditSubmission = require(`${__base}/server/rabbitmq/consumer/tasks/audit-submission`)
const errorService = require(`${__base}/server/services/error-service`)
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
    var model
    return app.models.ImmunizationSubmission.findById(message.json.id)
      .tap((submission) => {
        if (!submission) {
          throw errorService.IconCustomError('Record not found. Will not requeue job.')
        }
        model = submission
      })
      .then(getDataAndFiles)
      .then(prepareObjectForRequest)
      .then(sendToPhix)
      .then(auditSubmission)
      .then((objData) => deleteData(app, objData))
      .catch((err) => {
        logger.error(PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, err.message)
        if (model) {
          err.reQueue = true
          if (err.result) {
            return updateSubmission(model, err.result, config.phixEndpoint.repostCodes.includes(err.statusCode))
            .then(() => { throw err }) // we want the job re-Q'd so it will be tried again later
          }
        } else {
          throw err
        }
      })
  }

  return {
    startTask: startTask
  }
}
