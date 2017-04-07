'use strict'

var Promise = require('bluebird')
var cipher = require(`${__base}/server/services/crypto`)

module.exports = (app, transactionId, cryptoConfig) => {
  return Promise.resolve(transactionId)
         .then((transactionId) => app.models.SubmissionAttachment.find({where: {transactionId: transactionId}}))
         .then((files) => getDecryptedFileObject(files, cryptoConfig))
}

function getDecryptedFileObject (files, cryptoConfig) {
  var fileObject = []
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
