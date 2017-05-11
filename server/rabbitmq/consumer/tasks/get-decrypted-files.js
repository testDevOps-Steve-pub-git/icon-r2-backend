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
                .then(() => cipher.decrypt(file.fileContent, cryptoConfig))
                .then((decryptedFileContent) => {
                  fileObject.push({
                    content: decryptedFileContent,
                    name: file.originalFilename
                  })
                  return fileObject
                })
        }, Promise.resolve())
}
