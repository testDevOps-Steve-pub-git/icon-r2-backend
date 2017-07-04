'use strict'

const retrieveImmunization = require(`${__base}/server/services/immunization-retrieval`)
const PROCESS_TYPES = require(`${__base}/server/models/process-type`)
const Promise = require('bluebird')
const logger = require(`${__base}/server/services/logger-service`)
const util = require('util')

function buildOptions (req) {
  return {
    oiid: req.headers.oiid,
    context: req.headers['immunizations-context'],
    token: req.headers['session-token']
  }
}

function hasOperationOutcomeOrBundle (response) {
  return (response.body &&
          response.body.resourceType &&
          (response.body.resourceType !== 'OperationOutcome' || response.body.resourceType !== 'Bundle'))
}

// Log success and failures with operational outcomes
function logResponse (response, meta) {
  let options = {
    type: 'info',
    message: 'Success'
  }

  if (response.statusCode !== 200) {
    options.type = 'error'
    options.message = `Failed with ${response.statusCode} and ${util.inspect(response.body)}`
  }

  logger.log(options.type, PROCESS_TYPES.RETRIEVAL.RETRIEVAL, options.message, meta)

  return response
}

function validateResponse (response) {
  if (!hasOperationOutcomeOrBundle(response)) {
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
  if (response.body) res.write(JSON.stringify(response.body))
  res.end()

  return response
}

// - 200: return 200 and the fhir message
// - 4xx with operational outcomes: return
//   outcome and status code, and log
// - 5xx, 4xx without a response body and
//   other (non-http) errors: return 500 and log
module.exports = (req, res, next) => {
  Promise.resolve(req)
  .then(buildOptions)
  .then(retrieveImmunization)
  .then(validateResponse)
  .then((response) => {
    res.setHeader('Content-Type', 'application/json')
    return writeResponse(response, res)
  })
  .then((response) => {
    return logResponse(response, req.decoded)
  })
  .catch((err) => {
    err.decoded = req.decoded
    err.processType = PROCESS_TYPES.RETRIEVAL.RETRIEVAL
    err.stack = null

    throw err
  })
  .catch(next)
}
