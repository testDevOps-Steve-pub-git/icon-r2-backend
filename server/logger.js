/**
 * @module logger
 */
'use strict'
const winston = require('winston')
const Audit = require(__base + '/server/models/audit')
const Elasticsearch = require('winston-elasticsearch')
const useragent = require('express-useragent')
const tokenHeaders = require(`${__base}/server/models/token-headers`)
const phuService = require(`${__base}/server/services/token/phu-service`)
const getGeoIp = require(`${__base}/server/services/geoip-lookup`)
const elasticSearchConfig = require(`${__base}/config`).elasticSearch
const esMappingConfig = require(`${__base}/server/models/winston-elasticsearch-mapping.json`)
const trackingConfig = require(`${__base}/config`).tracking
const debug = require('debug')('icon:elasticsearch')

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
const esConfig = {
  level: 'info',
  indexPrefix: 'logs',
  mappingTemplate: esMappingConfig,
  clientOpts: {
    host: elasticSearchConfig.url,
    apiVersion: '5.x'
  }
}

// turn on elastic search tracing by adding DEBUG=icon:elasticsearch to command line
if (debug.enabled) {
  esConfig.clientOpts.log = 'trace'
}

// Instantiate winston auditor with transport for es output
// Transport explicitly adds a timestamp into the logged object
const auditor = new winston.Logger({
  transports: [
    new Elasticsearch(esConfig)
  ]
})

// Instantiate winston logger with transport for console output
// Transport explicitly adds a timestamp into the logged object
const logger = new winston.Logger({
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
  const options = {
    timestamp: new Date(),
    message: `[AUDIT] [${new Date()}] [SERVER] ${message}`,
    processType: processType
  }

  auditor.info(options)
  logger.info(options)
}

/**
  * getPhuInformation()
  *
  * Pulls information regarding the PHU from the host url
  *
  * @param  {String}  host      - Represents the host url containing PHU acronym
  * @param  {Object}  auditObj  - The audit object being built
  */
function getPhuInformation (host, auditObj) {
  return new Promise((resolve, reject) => {
    if (host) {
      phuService.getPhuObjectFromUrl(host)
      .then((phuObject) => {
        // Add phu specific information to audit if existing
        if (typeof phuObject !== 'undefined') {
          auditObj.phuName = phuObject.name
          auditObj.phuAcronym = phuObject.acronym
        }
        resolve()
      })
    } else {
      // No host present, resolve without attempting to pull PHU information
      resolve()
    }
  })
}

/**
  * @function creates audit for immunization submission and retrieval
  * @param {String} processType running when audit is needed
  * @param {Integer} statusCode response status code
  * @param {Object} request object for phu, session token, submission token
  */
function auditLog (processType, statusCode, reqHeaders, reqDecoded, extraObject) {
  return new Promise((resolve, reject) => {
    // Create base audit object with process type and response status code
    let auditObj = new Audit(processType, statusCode)

    auditObj.message = '[AUDIT] [' + auditObj.timestamp + ']'

    const sessionId = reqDecoded.sessionId
    const submissionId = reqDecoded.submissionId
    const fileCount = reqDecoded.fileAttachmentCount
    let clientip, host, agent, parsedUa, geoIp, uriParts

    // Add session token to audit if existing
    if (sessionId) {
      auditObj.sessionId = sessionId
    }

    // Add submission token to audit if existing
    if (submissionId) {
      auditObj.submissionId = submissionId
    }

    // Add count of files uploaded to audit if existing
    if (fileCount) {
      auditObj.fileCount = fileCount
    }

    if (extraObject && extraObject.transitionPage) {
      uriParts = extraObject.transitionPage.split('/')
      if (uriParts.includes(trackingConfig.authWorkflowUri)) {
        auditObj.isAuth = true
      }
      if (uriParts.includes(trackingConfig.anonWorkflowUri)) {
        auditObj.isAuth = false
      }
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

    // Parse phu information from request headers
    getPhuInformation(host, auditObj)
    .then(() => {
      // Log as audit
      let finalObject = {}
      Object.assign(finalObject, auditObj.toList(), extraObject)
      auditor.info(finalObject)
      logger.info(finalObject)

      resolve(finalObject)
    })
  })
}

function logIconError (err) {
  let metaObject = {
    processType: err.processType,
    statusCode: err.statusCode,
    message: err.message,
    decoded: err.decoded
  }
  if (err.logLevel === 'error') {
    metaObject['stackTrace'] = err.stackTrace
  }
  logger.error(metaObject)
}

// Public Functions
module.exports = {
  auditLog: auditLog,
  auditLogBackend: auditLogBackend,
  logIconError: logIconError,
  log: logger.log,
  info: logger.info,
  error: logger.error,
  debug: logger.debug,
  warn: logger.warn
}
