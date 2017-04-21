'use strict'

const Promise = require('bluebird')
const jwt = require('jsonwebtoken')

const errorService = require(`${__base}/server/services/error-service`)
const tokenConfig = require(`${__base}/config`).token
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

/**
 * @module jwt-service
 */
module.exports = jwtService()

/**
 * @function jwtService used to create, sign, and verify tokens
 * @return {{function} sign returns the token
 *          {function} verify return the decoded token}
 */
function jwtService () {
  /**
   * @function sign generates a token
   * A default payload values will be added such as: -
   *  aud: 'ICON-Server' // Request by MOH
   * A expiry time will be added based on token type
   * @param {Object} payload payload to be added to token
   * @param {{@link TokenType}} tokenType token state
   * @return {Promise<String>} promise to the token
   * @throws Error if anything goes wrong
   */
  function sign (payload, tokenType) {
    payload = Object.assign({
      aud: 'ICON-Server', // Request by MOH
      inactivity: tokenConfig.expiresIn.inactivity,
      responseTime: tokenConfig.expiresIn.responseTime
    }, payload)

    var expiresIn
    switch (tokenType) {
      case TOKEN_TYPE.SESSION:
        expiresIn = tokenConfig.expiresIn.session
        break
      case TOKEN_TYPE.SUBMISSION:
        expiresIn = expiresIn = tokenConfig.expiresIn.submission
        break
      default:
        throw errorService.IconCustomWarning('Invalid token type', { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
    }

    var options = {
      expiresIn: expiresIn
    }

    return Promise
           .try(() => jwt.sign(payload, tokenConfig.secretKey, options))
           .catch((err) => {
             throw errorService.IconCustomWarning(err.message, { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
           })
  }

  /**
   * @function verify verifies the token and return decoded value
   * @param {String} token jwt token
   * @return {Promise<Object>} promise to the decoded token
   * @throws Error if anything token is invalid or expired
   */
  function verify (token) {
    return Promise
            .try(() => jwt.verify(token, tokenConfig.secretKey))
            .catch((err) => {
              throw errorService.IconCustomWarning(err.message, { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
            })
  }

  return {
    sign: sign,
    verify: verify
  }
}
