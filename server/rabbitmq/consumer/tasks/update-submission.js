'use strict'

var logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

function createHistory (statusCode) {
  return `{timestamp: ${new Date()}, statusCode: ${statusCode}}`
}

function appendHistory (history, statusCode) {
  let newEntry = createHistory(statusCode)

  if (history) {
    return `${history.slice(0, -1)}, ${newEntry}]`
  } else {
    return `[${newEntry}]`
  }
}

/*
*  This function is used to update an immunization submission record which will be handled by 1the queue
*
*  The immunization submission is updated with a field that signifies DHIR to bypass validation
*  It is also updated with a list of all the previous failed submissions of this specific submission
*/
module.exports = function (immunizationModel, statusCode, isRepost) {
  return new Promise((resolve, reject) => {
    immunizationModel.updateAttributes({
      failedValidation: immunizationModel.failedValidation || isRepost,
      attemptHistory: appendHistory(immunizationModel.attemptHistory, statusCode)
    })
    .then((result) => {
      // Update of the record was succesfull, return fulfilled promise
      resolve()
    })
    .catch((err) => {
      // Update was unsuccesfull, log that there was an error and reject promise
      logger.error(err, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'Error updating record for requeue')
      reject(err)
    })
  })
}
