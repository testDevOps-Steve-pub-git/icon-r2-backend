'use strict'
var config = require(`${__base}/config`)                                  // Our Config File Object
var logger = require(`${__base}/server/logger`)                           // The Logging Object Used to log steps
var models = require(`${__base}/server/models/yellowcard/models`)         // Models for messages, status codes, etc...
var agentOptions = require(`${__base}/server/agent-options`)              // Agent Options for User/Client Info

/**
 *  CHECK Constant
 *
 *  @desc   This constant contains the boolean indicating if phix endpoint certificates
 *          were included in the server instance
 *  @return {list<bool>}          - list of booleans for checks
 */
const CHECK = {
  HAS_ENPOINT_CERTIFICATES: (!!config.phixEndpointCerts && !!config.phixEndpointCerts.retrieval)
}

/**
 *  addAgentOptions() Method
 *
 *  @desc   This method will add the agent options to the
 *          request options for retrieving a yellowcard from phix
 *
 *  @param  {list<object>}  PHIX_REQUEST_OPTIONS    - request options to form the request to PHIX
 *  @param  {list<object>}  metaObject              - list storing meta data about the client
 *  @return {List<object>}                          - Newly modified request options
 */
function addAgentOptions (PHIX_REQUEST_OPTIONS, metaObject) {
  // --> Generate a Logging Object for the Server to parse and log
  var PHIX_CERTS_WARNING_OBJECT = {
    processType: models.TYPES.PROCESSES.PHIX,
    message: models.MESSAGES.SSL_AUTHENTICATION_WARNING
  }

  // --> Generate Client Agent Options from agentOptions Object
  var clientAgentOptions = agentOptions.build(
    config.phixEndpointCerts.retrieval,
    function () {
      logger.debug(models.TYPES.LOGS.WARNING, Object.assign(PHIX_CERTS_WARNING_OBJECT, metaObject))
    }
  )

  // --> Add newly generated Client Agent Options Object into the PHIX Request Options Object
  PHIX_REQUEST_OPTIONS['agentOptions'] = clientAgentOptions

  return (PHIX_REQUEST_OPTIONS)
}

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
 *  YellowCardService.phix: generateRequestOptions() Method
 *
 *  @desc   This method will check if the endpoint for retrieval has
 *          certificates included.
 *
 *          Certs are included:
 *          |__ the method will add agent options to the request options
 *
 *          Certs are not included:
 *          |__ the method will create the request options without agent options
 *
 *  @param  {string}        oiid        - ontario immunization identifier
 *  @param  {string}        pin         - pin for retrievining the yellowcard from phix
 *  @param  {string}        token       - token for authorizing the rest api to obtain information to/from phix
 *  @param  {list<object>}  metaObject  - list storing meta data about the client
 *  @return {list<object>}              - list containing the url, method, (possibly agentOptions), and headers
 *                                        for the request to phix
 */
function generateRequestOptions (oiid, pin, token, metaObject) {
  if (CHECK.HAS_ENPOINT_CERTIFICATES) {
    return (
      addAgentOptions(
        createRequestOptions(oiid, pin, token),
        metaObject
      )
    )
  } else {
    return (createRequestOptions(oiid, pin, token))
  }
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
  var GATING_QUESTION_LOG_OBJECT = {
    processType: models.TYPES.PROCESSES.ICON,
    interactionType: models.TYPES.INTERACTIONS.RETRIEVAL,
    message: models.MESSAGES.GATING_QUESTION,
    reltoClient: relationship
  }

   // --> Log the generated Log Message
  logger.debug(models.LOG_LEVELS.INFO, Object.assign(GATING_QUESTION_LOG_OBJECT, metaObject))
}

/**
 *  YellowCardService: PhixService() Method
 *
 *  @desc   This method will create a list of functions used for the phix retrieval processType
 *  @return {list<object>}                    - list of functions to aide in the phix retrieval process
 */
function PhixService () {
  return ({
    generateRequestOptions: generateRequestOptions,
    logGatingQuestion: logGatingQuestion
  })
}

module.exports = PhixService()
