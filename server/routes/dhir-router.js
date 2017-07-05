'use strict'

const Promise = require('bluebird')
const logger = require(`${__base}/server/logger`)
const util = require('util')

// these have to passed in via res.locals
let processType = 'MISSING'
let service = () => { throw new Error('no service supplied') }

function callService (options) {
  processType = options.processType
  service = require(options.service)
  return service(options.request)
}

function hasOperationOutcomeOrBundle (response) {
  return (response.body &&
    response.body.resourceType &&
    (response.body.resourceType === 'OperationOutcome' ||
     response.body.resourceType === 'Bundle'))
}

// Log success and failures with operational outcomes
function logResponse (response, meta) {
  let options = {
    type: 'info',
    message: 'Success'
  }
  if (response.statusCode !== 200) {
    options.type = 'error'
    options.message = `Failed with ${response.statusCode} and ${util.inspect(JSON.stringify(response.body))}`
  }
  logger[`${options.type}`](options.message, Object.assign({ processType: processType }, meta))

  return response
}

function validateResponse (response) {
  if (!hasOperationOutcomeOrBundle(response) && response.statusCode !== 200) {
    let err = new Error(`Internal Server Error returning 500.
      statusCode: was ${response.statusCode}
      statusMessage: ${response.statusMessage}
      href: ${response.request.href}
    `)
    err.statusCode = 500
    throw err
  }

  return response
}

function writeResponse (response, res) {
  res.statusCode = response.statusCode
  res.setHeader('Content-Type', 'application/json')
  if (response.body) res.write(JSON.stringify(response.body))
  res.end()
  return response
}

// - 200: return 200 and the fhir message
// - 4xx with operational outcomes: return
//   outcome and status code, and log
// - 5xx, 4xx without a response body and
//   other (non-http) errors: return 500 and log
//
//   Requires that res.locals.dhirRouter has been
//   loaded with the service filepath, service request
//   options and the process type
module.exports = (req, res, next) => {
  Promise.resolve(res.locals.dhirRouter)
  .then(callService)
  .then(validateResponse)
  .then((response) => writeResponse(response, res))
  .then((response) => logResponse(response, req.decoded))
  .then((response) => logger.auditLog(processType, response.statusCode, req.headers, req.decoded))
  .catch((err) => {
    err.decoded = req.decoded
    err.processType = processType
    err.stack = null

    throw err
  })
  .catch(next)
}
