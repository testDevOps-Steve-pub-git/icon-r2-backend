'use strict'

const Promise = require('bluebird')
const cipher = require(`${__base}/server/services/crypto`)

module.exports = (app, transactionId, cryptoConfig) => {
  return Promise.resolve(transactionId)
         .then((transactionId) => app.models.SubmissionAttachment.find({where: {transactionId: transactionId}}))
         .then((files) => getDecryptedFileObject(files, cryptoConfig))
}

function getDecryptedFileObject (files, cryptoConfig) {
  let fileObject = []
  return files
        .reduce((promise, file) => {
          return promise
                .then(() => {
                  // pass encryption separately as its only used for files and not fhir
                  return cipher.decrypt(file.fileContent, cryptoConfig, cryptoConfig.fileEncoding)
                })
                .then((decryptedFileContent) => {
                  fileObject.push({
                    content: decryptedFileContent,
                    name: file.originalFilename
                  })
                  return fileObject
                })
        }, Promise.resolve())
}
