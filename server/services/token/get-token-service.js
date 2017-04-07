'use strict'

var Promise = require('bluebird')

var errorService = require(`${__base}/server/services/error-service`)
var guidService = require(`${__base}/server/services/token/guid-service`)
var phuService = require(`${__base}/server/services/token/phu-service`)
var jwtService = require(`${__base}/server/services/token/jwt-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

/**
 * @module get-token-service
 */
module.exports = getTokenService()

/**
 * @function getTokenService service to generate the tokens
 * @return {{function} createToken Create the token}
 */
function getTokenService () {
  /**
   * @function getPayload create the payload for the token
   * @param {{@link TokenType}} tokenType token state
   * @param {Object} phuObject represents the JSON object with phu information
   * @param {Object} payloadObject represents the additional payload in JSON format to be added to token
   * @return {Object} payload for the token
   * @throws Error if anything token type is not valid
   */
  function getPayload (tokenType, phuObject, payloadObject) {
    switch (tokenType) {
      case TOKEN_TYPE.SESSION:
        // do not genereate new session id for refresh token
        if (!payloadObject.sessionId) {
          payloadObject.sessionId = phuObject.acronym + '-' + guidService.base64Guid()
        }
        break
      case TOKEN_TYPE.SUBMISSION:
        // do not genereate new submission id for refresh token
        if (!(payloadObject.submissionId || payloadObject.txId)) {
          var tokenId = phuObject.acronym + '-' + guidService.base31Guid()
          payloadObject.txId = tokenId // Added for backward compatibility
          payloadObject.submissionId = tokenId
        }
        break
      default:
        throw errorService.IconCustomWarning('Invalid token type', { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
    }

    return payloadObject
  }

  /**
   * @function createToken create the token
   * @param {{@link TokenType}} tokenType token state
   * @param {String} url represents the host url
   * @param {Object} additionalPayload represents the additional payload in JSON format to be added to token
   * @return {Promise<Object>} promise to the generated token
   * @throws Error if anything goes wrong
   */
  function createToken (tokenType, url, additionalPayload) {
    additionalPayload = (typeof additionalPayload !== 'undefined') ? additionalPayload : {}
    return Promise.resolve(url)
           .then(phuService.getPhuObjectFromUrl)
           .then((phuObject) => getPayload(tokenType, phuObject, additionalPayload))
           .then((payload) => jwtService.sign(payload, tokenType))
  }

  return {
    createToken: createToken
  }
}
