'use strict'

function validSize (file, config) {
  if (config.size) {
    return file.buffer.length < config.size
  } else {
    return true
  }
}

function validType (file, config) {
  if (config.types) {
    return config.types.includes(file.mimetype)
  } else {
    return true
  }
}

function validLimit (app, txId, config) {
  if (config.limit) {
    return app.models.SubmissionAttachment.count({transactionId: txId})
    .then((count) => {
      return count < config.limit
    })
  } else {
    return Promise.resolve(true)
  }
}

module.exports = {
  validLimit: validLimit,
  validSize: validSize,
  validType: validType
}
