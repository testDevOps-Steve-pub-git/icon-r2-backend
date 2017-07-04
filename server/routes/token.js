'use strict'

const Promise = require('bluebird')
const logger = require(`${__base}/server/logger`)
const errorService = require(`${__base}/server/services/error-service`)
const tokenService = require(`${__base}/server/services/token-service`)
const tokenDecodePayload = require(`${__base}/server/models/token-decode-payload`)
const tokenHeaders = require(`${__base}/server/models/token-headers`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

/**
 * @module token
 */
module.exports = token()
/**
 * @function token service to authenticate session and submission tokens
 * @return {{function} authenticateSessionToken authenticate the session token,
 *          {function} authenticateSessionAndSubmissionToken authenticate the session and submission token}
 */
function token () {
  /**
   * @function authenticateToken return the promise to authenticate the token
   * @param {{@link TokenType}} tokenType token state
   * @param {Object} headers represents the request headers
   * @return {Promise<Object>} promise to the decoded token
   * @throws Error if anything went wrong
   */
  function authenticateToken (tokenType, headers) {
    // let promise
    let token
    const host = tokenHeaders.getHost(headers)

    return Promise.try(() => {
      switch (tokenType) {
        case TOKEN_TYPE.SESSION:
          token = tokenHeaders.getSessionToken(headers)
          if (typeof token === 'undefined') {
            throw errorService.IconCustomWarning('Session token not found', { processType: PROCESS_TYPE.AUTHENTICATE.SESSION })
          }
          return tokenService.authenticate.session(host, token)
        case TOKEN_TYPE.SUBMISSION:
          token = tokenHeaders.getSubmissionToken(headers)
          if (typeof token === 'undefined') {
            throw errorService.IconCustomWarning('Submission token not found', { processType: PROCESS_TYPE.AUTHENTICATE.SUBMISSION })
          }
          return tokenService.authenticate.submission(host, token)
        default:
          throw errorService.IconCustomWarning('Invalid token type', { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
      }
    })
  }

  /**
   * @function authenticateSessionToken authenticate the session token and add the decoded value to the req.decoded property
   * @param {Object} req incoming request
   * @param {Object} res outgoing response
   * @param {callback} next callback to next service
   */
  function authenticateSessionToken (req, res, next) {
    Promise.resolve(req.headers)
    .then((headers) => authenticateToken(TOKEN_TYPE.SESSION, headers))
    .then((decodedToken) => {
      req.decoded = new tokenDecodePayload.CreateSessionPayload(decodedToken, req.headers)
    })
    .then(next)
    .catch((err) => {
      if (!err.logged) {
        logger.logIconError(err)
        err.logged = true
      }
      throw err
    })
    .catch(next)
  }

  /**
   * @function authenticateSubmissionToken authenticate the submission token and append the decoded value to the req.decoded property
   * @param {Object} req incoming request
   * @param {Object} res outgoing response
   * @param {callback} next callback to next service
   */
  function authenticateSubmissionToken (req, res, next) {
    Promise.resolve(req.headers)
    .then((headers) => authenticateToken(TOKEN_TYPE.SUBMISSION, headers))
    .then((decodedToken) => { Object.assign(req.decoded, new tokenDecodePayload.CreateSubmissionPayload(decodedToken, req.headers)) }) // Append the new decoded payload to req.decoded
    .then(next)
    .catch((err) => {
      if (!err.logged) {
        logger.logIconError(err)
        err.logged = true
      }
      throw err
    })
    .catch(next)
  }

  return {
    authenticateSessionToken: authenticateSessionToken,
    authenticateSessionAndSubmissionToken: [authenticateSessionToken, authenticateSubmissionToken]
  }
}
