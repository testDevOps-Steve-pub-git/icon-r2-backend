'use strict'
var errorService = require(`${__base}/server/services/error-service`)  // --> For error handling

/**
 * YellowCardService.error: create()
 *
 * @desc   This function will create an error object using the error,
 *         decoded request payload, and the process type passed in.
 *
 * @param  {request}  error        - the error object
 * @param  {list}     decoded      - the decoded request payload
 * @param  {string}   processType  - the process type being executed
 * @param  {integer}  statusCode   - the status code of the response
 * @return {IconError}             - icon error object to use for logging to the server
 */
function createError (error, decoded, processType, statusCode) {
  var myError = new errorService.IconError(error)
  myError.processType = processType
  myError.statusCode = statusCode
  myError.decoded = decoded
  return myError
}

/**
 *  YellowCardService: ErrorService()
 *
 *  @desc   This function will create a list of functions to provided
 *          for creating an error within the yellowcard retrieval process.
 *
 *          This list wrappers the createError() above
 *
 */
function ErrorService () {
  return ({
    create: createError
  })
}

module.exports = ErrorService()
