/**
 * @module logger
 */
'use strict'
var winston = require('winston')
var Audit = require(__base + '/server/models/audit')
var Elasticsearch = require('winston-elasticsearch')
var useragent = require('express-useragent')
var tokenHeaders = require(`${__base}/server/models/token-headers`)
var phuService = require(`${__base}/server/services/token/phu-service`)
var getGeoIp = require(`${__base}/server/services/geoip-lookup`)
var elasticSearchConfig = require(`${__base}/config`).elasticSearch
var esMappingConfig = require(`${__base}/server/models/winston-elasticsearch-mapping.json`)

winston.addColors({
  error: 'red',
  warn: 'yellow',
  audit: 'green',
  info: 'white'
})

/**
  * @function Creates Elasticsearch options object to be used when instantiating transport
  *           Required due to ES only allowing instantiation of one client per options object
  * @return {Object} ES options object
  */
var esConfig = {
  level: 'info',
  indexPrefix: 'logs',
  mappingTemplate: esMappingConfig,
  clientOpts: {
    host: elasticSearchConfig.url,
    apiVersion: '2.4'
  }
}

// Instantiate winston auditor with transport for es output
// Transport explicitly adds a timestamp into the logged object
let auditor = new winston.Logger({
  transports: [
    new Elasticsearch(esConfig)
  ]
})

// Instantiate winston logger with transport for console output
// Transport explicitly adds a timestamp into the logged object
let logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      timestamp: true,
      formatter: function (options) {
        return JSON.stringify(Object.assign({
          level: options.level,
          message: options.message
        }, options.meta))
      }
    })
  ]
})

/**
  * @function creates audit for the backend ie. no status, req, res data
  * @param {String} processType running when audit is needed
  * @param {Object} message to log
  */
function auditLogBackend (processType, message) {
  let options = {
    timestamp: new Date(),
    message: `[AUDIT] [${new Date()}] [SERVER] ${message}`,
    processType: processType
  }

  auditor.info(options)
  logger.info(options)
}

/**
  * @function creates audit for immunization submission and retrieval
  * @param {String} processType running when audit is needed
  * @param {Integer} statusCode response status code
  * @param {Object} request object for phu, session token, submission token
  */
function auditLog (processType, statusCode, reqHeaders, reqDecoded, extraObject) {
  // Create base audit object with process type and response status code
  let auditObj = new Audit(processType, statusCode)

  auditObj.message = '[AUDIT] [' + auditObj.timestamp + ']'

  let sessionId = reqDecoded.sessionId
  let submissionId = reqDecoded.submissionId
  let clientip, host, agent, parsedUa, geoIp

  // Add session token to audit if existing
  if (sessionId) {
    auditObj.sessionId = sessionId
  }

  // Add submission token to audit if existing
  if (submissionId) {
    auditObj.submissionId = submissionId
  }

  if (reqHeaders) {
    // Pull audit infromation from request headers
    clientip = tokenHeaders.getIp(reqHeaders)
    host = tokenHeaders.getHost(reqHeaders)

    // Add referer information if existing
    if (reqHeaders.referer) {
      auditObj.referer = reqHeaders.referer
    }

    // Add agent specific information to audit if existing
    if (reqHeaders['user-agent']) {
      agent = reqHeaders['user-agent']
      parsedUa = useragent.parse(agent)
      auditObj.browserName = parsedUa.browser
      auditObj.os = parsedUa.os
      auditObj.device = parsedUa.platform
      auditObj.isMobile = parsedUa.isMobile
    }

    // Parse phu information from request headers
    phuService.getPhuObjectFromUrl(host)
    .then((phuObject) => {
      // Add phu specific information to audit if existing
      if (typeof phuObject !== 'undefined') {
        auditObj.phuName = phuObject.name
        auditObj.phuAcronym = phuObject.acronym
      }
    })
  }

  // Check for client ip and pull geoIp information
  if (clientip) {
    geoIp = getGeoIp(clientip)
    auditObj.clientip = clientip
  }

  // Ensure geoIp exists (will be null from an internal IP)
  if (geoIp && geoIp.ll) {
    auditObj.location = geoIp.ll.reverse()
  }

  // Log as audit
  var finalObject = {}
  Object.assign(finalObject, auditObj.toList(), extraObject)
  auditor.info(finalObject)
  logger.info(finalObject)

  return finalObject
}

// Public Functions
module.exports = {
  auditLog: auditLog,
  auditLogBackend: auditLogBackend,
  info: logger.info,
  error: logger.error,
  debug: logger.debug,
  warn: logger.warn
}
