'use strict'

function LoggerService () {
  var logger = require(`${__base}/server/logger`)

  // private methods
  function assignObject (processType, err, metaObject) {
    return Object.assign({
      processType: processType,
      message: 'error: ' + err.message
    }, metaObject)
  }

  function logInfo (processType, message) {
    logger.info(message, {processType: processType})
  }

  function logError (processType, err, metaObject) {
    logger.error(assignObject(processType, err, metaObject))
  }

  function logWarning (processType, err, metaObject) {
    logger.warn(assignObject(processType, err, metaObject))
  }

  function logDebug (processType, message) {
    logger.debug(message, {processType: processType})
  }

  function logIconError (err) {
    let metaObject = {
      processType: err.processType,
      message: err.message,
      decoded: err.decoded
    }
    if (err.logLevel === 'error') {
      metaObject['stackTrace'] = err.stackTrace
    }
    logger.error(metaObject)
  }

  function log (logType, processType, message, metaObject) {
    if (logType === 'error') {
      if (message instanceof Error) {
        message = 'error: ' + message.message
      } else {
        message = 'error: ' + message
      }
    }

    logger.info(Object.assign({
      processType: processType,
      message: message
    }, metaObject))
  }

  // public methods
  return {
    logError: logError,
    logWarning: logWarning,
    logDebug: logDebug,
    logInfo: logInfo,
    log: log,
    logIconError: logIconError,
    logIcon: logIconError
  }
}

// Create a singleto logger service
module.exports = new LoggerService()
