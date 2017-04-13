'use strict'
var Promise = require('bluebird')                                            // --> For Handling Promises
var request = Promise.promisifyAll(require('request'), {multiArgs: true})    // --> Promisified Request Object
var ycModels = require(`${__base}/server/models/yellowcard/models`)          // --> Models for messages, status codes, etc...
var ycService = require(`${__base}/server/services/yellowcard-service`)      // --> All Yellowcard Services
var logger = require(`${__base}/server/logger`)                              // --> Logs information to console
var errorService = require(`${__base}/server/services/error-service`)

/**
 * getResponseConditions()

 * @desc   Generates a Response Condition List for checking the response from PHIX
 *
 * @param  {integer}  statusCode  - the integer representation of the status code from PHIX Response
 * @param  {error}    error       - the error Object
 * @return {list}                 - list of valid boolean logic to check the response from PHIX
 * ==============================================================================================================
 */
function getResponseConditions (statusCode, error) {
  return ({
    'ERROR_IN_RESPONSE': (!!error === true),
    'GOT_RESPONSE': (!!statusCode && !!((statusCode === ycModels.STATUS_CODES.OK) || !!(statusCode === ycModels.STATUS_CODES.CREATED)) === true)
  })
}

/**
 * phix-retrieval()
 *
 * @desc    This function will request a yellowcard from phix.
 *
 *          The function will perform the following steps:
 *          |__ 1) Log the gating question to the server
 *          |__ 2) Generate the request options for the request
 *          |__ 3) Request a yellowcard from phix
 *          |__ 4) Check the response
 *              |__ error:    end the response and throw an appropriate error
 *              |__ success:  go to the next chain in the middleware
 *
 * @param {request}  req        - the request object from the node server
 * @param {response} res        - the response object from the node server
 * @param {next}     next       - the next callback in the chain
 */
module.exports = (req, res, next) => {
  ycService.phix.logGatingQuestion(req.session.client.relationship, req.session.metaData)

  // Create request options for interacting with PHIX
  var requestOptions = ycService.phix.generateRequestOptions(
    req.session.client.oiid,
    req.session.client.pin,
    req.session.token,
    req.session.metaData
  )

  // Attempt to complete request to PHIX
  request.getAsync(requestOptions)
  .spread((responseFromPhix, bodyFromPhix, errorFromPhix) => {
    if (getResponseConditions(responseFromPhix.statusCode, errorFromPhix).GOT_RESPONSE) {
      res.setHeader('Content-type', 'application/json')
      res.write(bodyFromPhix)
      res.end()
    } else {
      // If there is no response, throw an error which is picked up by following catch
      throw errorService.IconCustomError(ycModels.MESSAGES.PHIX.ERRORS.RESPONSE_NOT_PARSED, {
        decoded: req.decoded,
        processType: ycModels.TYPES.PROCESSES.PHIX,
        statusCode: responseFromPhix.statusCode || ycModels.STATUS_CODES.INTERNAL_SERVER_ERROR
      })
    }
  }).catch((err) => {
    // End response with status code returned from PHIX
    res.writeHead(err.statusCode)
    res.end()
    // Log the error to console
    logger.error(err.message, {
      decoded: req.decoded,
      processType: ycModels.TYPES.PROCESSES.PHIX,
      statusCode: err.statusCode || ycModels.STATUS_CODES.INTERNAL_SERVER_ERROR
    })
  })
}
