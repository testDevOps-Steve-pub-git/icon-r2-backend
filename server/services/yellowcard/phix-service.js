'use strict'
const config = require(`${__base}/config`)                                  // Our Config File Object
const logger = require(`${__base}/server/logger`)                           // The Logging Object Used to log steps
const models = require(`${__base}/server/models/yellowcard/models`)         // Models for messages, status codes, etc...

/**
 *  createRequestOptions() Method
 *
 *  @desc   This method will create a list containing the request options
 *          for retrievining a yellowcard from PHIX
 *
 *  @param  {string}        oiid    - ontario immunization identifier
 *  @param  {string}        pin     - pin for retrievining the yellowcard from phix
 *  @param  {string}        token   - token for authorizing the rest api to obtain information to/from phix
 *  @return {list<object>}          - list containing the url, method, and headers for the request to phix
 */
function createRequestOptions (oiid, pin, token) {
  return ({
    url: config.phixEndpoint.retrieval.url + models.PHIX.PATIENT_PATH_URI(oiid),
    method: 'GET',
    headers: models.PHIX.HEADERS(pin, token)
  })
}

/**
 *  YellowCardService.phix: logGatingQuestion() Method
 *
 *  @desc   This method will log to the server the gating question for retrieving a yellowcard
 *          from phix.
 *
 *  @param  {string}        relationship      - string indicating the relationship to the patient on the yellowcard
 *  @param  {list<object>}  metaObject        - list storing meta data about the client
 */
function logGatingQuestion (relationship, metaObject) {
  // --> Generate Log Message: Gating Question, and log to the server
  const GATING_QUESTION_LOG_OBJECT = {
    processType: models.TYPES.PROCESSES.ICON,
    interactionType: models.TYPES.INTERACTIONS.RETRIEVAL,
    message: models.MESSAGES.GATING_QUESTION,
    reltoClient: relationship
  }

   // --> Log the generated Log Message
  return logger.debug(models.LOG_LEVELS.INFO, Object.assign(GATING_QUESTION_LOG_OBJECT, metaObject))
}

/**
 *  YellowCardService: PhixService() Method
 *
 *  @desc   This method will create a list of functions used for the phix retrieval processType
 *  @return {list<object>}                    - list of functions to aide in the phix retrieval process
 */
function PhixService () {
  return ({
    generateRequestOptions: createRequestOptions,
    logGatingQuestion: logGatingQuestion
  })
}

module.exports = PhixService()
