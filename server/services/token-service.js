'use strict'

var getTokenService = require(`${__base}/server/services/token/get-token-service`)
var validateTokenService = require(`${__base}/server/services/token/validate-token-service`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

/**
 * @module token-service
 */
module.exports = tokenService()

/**
 * @function tokenService service to generate and authenticate session and submission tokens
 * @return {{generate: {
 *               {function} session Get the session token,
 *               {function} submission Get the submission token
 *               }
 *          },
 *          {authenticate: {
 *              {function} session Authenticate the session token,
 *              {function} submission: Authenticate the submission token
 *              }
 *          }
 *         }
 */
function tokenService () {
  /**
   * @function getSessionToken Get the session token
   * @param {String} url represents the host url
   * @param {Object} additionalPayload represents the additional payload in JSON format to be added to token
   * @return {Promise<Object>} promise to the generated session token
   * @throws Error if anything went wrong or if token is invalid or expired
   */
  function getSessionToken (url, additionalPayload) {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, url, additionalPayload)
  }

  /**
   * @function getSubmissionToken Get the submission token
   * @param {String} url represents the host url
   * @param {Object} additionalPayload represents the additional payload in JSON format to be added to token
   * @return {Promise<Object>} promise to the generated submission token
   * @throws Error if anything went wrong or if token is invalid or expired
   */
  function getSubmissionToken (url, additionalPayload) {
    return getTokenService.createToken(TOKEN_TYPE.SUBMISSION, url, additionalPayload)
  }

  /**
   * @function authenticateSessionToken Authenticate the session token
   * @param {String} url represents the host url
   * @param {String} token represents the session token
   * @return {Promise<Object>} promise to the decoded token
   * @throws Error if anything went wrong or if token is invalid or expired
   */
  function authenticateSessionToken (url, token) {
    return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, url, token)
  }

  /**
   * @function authenticateSubmissionToken Authenticate the submission token
   * @param {String} url represents the host url
   * @param {String} token represents the submission token
   * @return {Promise<Object>} promise to the decoded token
   * @throws Error if anything went wrong or if token is invalid or expired
   */
  function authenticateSubmissionToken (url, token) {
    return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, url, token)
  }

  return {
    generate: {
      session: getSessionToken,
      submission: getSubmissionToken
    },
    authenticate: {
      session: authenticateSessionToken,
      submission: authenticateSubmissionToken
    }
  }
}
