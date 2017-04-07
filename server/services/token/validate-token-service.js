'use strict'

var Promise = require('bluebird')

var phuService = require(`${__base}/server/services/token/phu-service`)
var jwtService = require(`${__base}/server/services/token/jwt-service`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

/**
 * @module validate-token-service
 */
module.exports = validateTokenService()

/**
 * @function validateTokenService service to validate the session and submission tokens
 * @return {{function} verifyToken verifies the token}
 */
function validateTokenService () {
  /**
   * @function verifyAndBuildDecodedPayload verify the decoded values of the token and build a new payload with additional PHU information
   * @param {{@link TokenType}} tokenType token state
   * @param {Object} decodedPayload represents the decoded portion of the token
   * @param {Object} phuObject represents the additional information of PHU
   * @return {Object} payload with the decoded value as well as the phu information
   * @throws Error if anything token type is invalid or token content is not valid
   */
  function verifyAndBuildDecodedPayload (tokenType, decodedPayload, phuObject) {
    var tokenId
    switch (tokenType) {
      case TOKEN_TYPE.SESSION:
        if (typeof decodedPayload.sessionId === 'undefined') {
          throw new Error('Missing sessionId in decoded token')
        }
        tokenId = decodedPayload.sessionId
        break
      case TOKEN_TYPE.SUBMISSION:
        if (typeof decodedPayload.submissionId === 'undefined' && typeof decodedPayload.txId === 'undefined') { // txId added for backward compatibility
          throw new Error('Missing submissionId in decoded token')
        }
        tokenId = decodedPayload.submissionId || decodedPayload.txId // txId added for backward compatibility
        break
      default:
        throw new Error('Invalid token type')
    }
    // Verifies the first part of token id matches the phu acronym
    // For example: tokenId = GBHU-lCeZUhr and phu acronym from phu.json is GBHU
    //              then it's an valid tokenId
    if (tokenId.indexOf(phuObject.acronym) !== 0) {
      throw new Error('Invalid token content')
    }

    decodedPayload.phuName = phuObject.name
    decodedPayload.phuId = phuObject.id
    decodedPayload.phuAcronym = phuObject.acronym // used for logging

    return decodedPayload
  }

  /**
   * @function verifyToken verifies the token
   * @param {{@link TokenType}} tokenType token state
   * @param {String} url represents the host url
   * @param {String} token represents the jwt token
   * @return {Promise<Object>} promise to the decoded token
   * @throws Error if token or it's content is not valid
   */
  function verifyToken (tokenType, url, token) {
    return Promise
          .all([
            jwtService.verify(token),
            phuService.getPhuObjectFromUrl(url)
          ])
          .then(([decodedPayload, phuObject]) => {
            if (typeof decodedPayload !== 'undefined') {
              return verifyAndBuildDecodedPayload(tokenType, decodedPayload, phuObject)
            } else {
              throw new Error('No decoded payload found in token')
            }
          })
  }

  return {
    verifyToken: verifyToken
  }
}
