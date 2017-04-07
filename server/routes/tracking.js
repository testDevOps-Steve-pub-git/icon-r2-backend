'use strict'

var statusCodes = require(`${__base}/server/models/response-status-code`)
var processTypes = require(`${__base}/server/models/process-type`)
var logger = require(`${__base}/server/logger`)
var loggerService = require(`${__base}/server/services/logger-service`)
var trackingService = require(`${__base}/server/services/tracking-service`)

module.exports = (req, res) => {
  try {
    Object.assign(req.headers, {
      'x-real-ip': req.connection.remoteAddress
    })
    var auditObj = logger.auditLog(processTypes.ICON_UI, statusCodes.ACCEPTED, req.headers, req.decoded, getObject(req.body))
    if (auditObj) {
      trackingService.updateComponentTime(auditObj.sessionId, auditObj.timestamp)
    }
    res.status(statusCodes.ACCEPTED).end()
  } catch (err) {
    loggerService.logError(processTypes.ICON_UI, err, req.decoded)
    res.status(statusCodes.INTERNAL_SERVER_ERROR).end()
  }
}

/*
 *  function: getObject()
 *
 *  This function strips the required fields out of the body, checks if they were actually
 *  in the body, and if they are, adds them to a temporary object which is then sent to the audit logger
 *
 *  @param  {Object}      - Object representing body of request sent to api
 *  @return               - Object created from request body with required fields to be sent to audit logger
 */
function getObject (body) {
  var arr = ['chiSurvey', 'setLanguage', 'contactPhu', 'transitionPage', 'userReceivedPhuLetter', 'areAllOntarioImmunizations', 'areAllCanadaImmunizations']

  var obj = arr.reduce(function (obj, key) {
    if (body[key]) {
      obj[key] = body[key]
    }
    return obj
  }, {})

  return obj
}
