'use strict'

const statusCodes = require(`${__base}/server/models/response-status-code`)
const PROCESS_TYPES = require(`${__base}/server/models/process-type`)
const logger = require(`${__base}/server/logger`)
const trackingService = require(`${__base}/server/services/tracking-service`)
const trackingConfig = require(`${__base}/config`).tracking

module.exports = (req, res) => {
  Object.assign(req.headers, {
    'x-real-ip': req.connection.remoteAddress
  })
  logger.auditLog(PROCESS_TYPES.ICON_UI, statusCodes.ACCEPTED, req.headers, req.decoded, getSafeAudit(req.body))
  .then(updateSessionTime)    // NOTE: Currently disabled in config since UI is now calculating durations.
  .then(updateComponentTime)  // NOTE: Currently disabled in config since UI is now calculating durations.
  .then(() => { res.status(statusCodes.ACCEPTED).end() })
  .catch((err) => {
    logger.error(err.message, Object.assign(err, {
      processType: PROCESS_TYPES.ICON_UI,
      decoded: req.decoded
    }))
    res.status(statusCodes.INTERNAL_SERVER_ERROR).end()
  })
}

// If this is the last page, update the session time
function updateSessionTime (audit) {
  if (isLastPage(audit)) {
    trackingService.updateSessionTime(audit.sessionId, audit.timestamp)
  }
  return audit
}

function updateComponentTime (audit) {
  if (audit) {
    trackingService.updateComponentTime(audit.sessionId, audit.timestamp)
  }
  return audit
}

function isLastPage (audit) {
  return audit &&
    audit.transitionPage &&
    audit.transitionPage.split('/').includes(trackingConfig.endSessionPage)
}

/**
 *  This function strips the required fields out of the body, checks if they were actually
 *  in the body, and if they are, adds them to a temporary object which is then sent to the audit logger
 *  @param  {Object} body - Object representing body of request sent to api
 *  @return {Object} - Object created from request body with required fields to be sent to audit logger
 */
function getSafeAudit (body) {
  let safeAuditKeys = [
    'transitionPage',
    'duration',
    'areAllOntarioImmunizations',
    'areAllCanadaImmunizations',
    'chiSurvey',
    'contactPhu',
    'setLanguage',
    'userReceivedPhuLetter'
  ]

  // Only carry forward safe keys in the audit object.
  let audit = safeAuditKeys
      .reduce((obj, key) => {
        if (body[key] !== undefined) obj[key] = body[key]
        return obj
      }, {})

  return audit
}
