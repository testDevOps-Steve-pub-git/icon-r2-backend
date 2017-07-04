'use strict'

const logger = require(`${__base}/server/logger`)
const errorService = require(`${__base}/server/services/error-service`)
const tokenService = require(`${__base}/server/services/token-service`)
const tokenHeaders = require(`${__base}/server/models/token-headers`)
const tokenConfig = require(`${__base}/config`).token
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

const REFRESH_TOKEN = true

module.exports = function (Token) {
  Token.disableRemoteMethodByName('create')
  Token.disableRemoteMethodByName('upsert')
  Token.disableRemoteMethodByName('updateAll')
  Token.disableRemoteMethodByName('prototype.updateAttributes')
  Token.disableRemoteMethodByName('replaceById')
  Token.disableRemoteMethodByName('replaceOrCreate')
  Token.disableRemoteMethodByName('upsertWithWhere')

  Token.disableRemoteMethodByName('find')
  Token.disableRemoteMethodByName('findById')
  Token.disableRemoteMethodByName('findOne')

  Token.disableRemoteMethodByName('deleteById')

  Token.disableRemoteMethodByName('confirm')
  Token.disableRemoteMethodByName('count')
  Token.disableRemoteMethodByName('exists')
  Token.disableRemoteMethodByName('createChangeStream')

  Token.disableRemoteMethodByName('prototype.__count__accessTokens')
  Token.disableRemoteMethodByName('prototype.__create__accessTokens')
  Token.disableRemoteMethodByName('prototype.__delete__accessTokens')
  Token.disableRemoteMethodByName('prototype.__destroyById__accessTokens')
  Token.disableRemoteMethodByName('prototype.__findById__accessTokens')
  Token.disableRemoteMethodByName('prototype.__get__accessTokens')
  Token.disableRemoteMethodByName('prototype.__updateById__accessTokens')

  /**
   * @function checkForMaximumRefreshDuration return true if valid or throws and error
   * @param {int} originalIat Original Issue At
   * @return {boolean} returns true if the maximum refresh duration of token is valid
   * @throws Will throw an error if duration of token already reached the limit of maximum allowance
   */
  function checkForMaximumRefreshDuration (originalIat) {
    const currentTimeInSeconds = (Date.now() / 1000)
    const timeDiff = Math.ceil(Math.abs(currentTimeInSeconds - originalIat))
    if (timeDiff > tokenConfig.maximumRefreshDuration) {
      throw new Error('Reached the limit to generate the refresh token')
    }
    return true
  }

  /**
   * @function getToken return the token
   * @param {{@link TokenType}} tokenType token state
   * @param {boolean} isRefreshToken Whether it's a refresh token or new token
   * @param {object} req incoming request
   * @return {Promise<string>} returns the promise to the token string
   * @throws Will throw an error if anything went wrong or invalid token type
   */
  function getToken (tokenType, isRefreshToken, req) {
    const host = tokenHeaders.getHost(req.headers)
    let generateTokenPromise
    let additionalPayload = {}
    let originalIat
    switch (tokenType) {
      case TOKEN_TYPE.SESSION:
        if (isRefreshToken) {
          originalIat = req.decoded.originalIat
          checkForMaximumRefreshDuration(originalIat)
          additionalPayload.originalIat = originalIat
          additionalPayload.sessionId = req.decoded.sessionId
        }
        generateTokenPromise = tokenService.generate.session
        break
      case TOKEN_TYPE.SUBMISSION:
        // Add sessionId to submission token
        additionalPayload.sessionId = req.decoded.sessionId
        if (isRefreshToken) {
          originalIat = req.decoded.originalIat
          checkForMaximumRefreshDuration(originalIat)
          additionalPayload.originalIat = originalIat
          additionalPayload.txId = req.decoded.txId // Added for backward compatibility
          additionalPayload.submissionId = req.decoded.submissionId
        }
        generateTokenPromise = tokenService.generate.submission
        break
      default:
        throw errorService.IconCustomWarning('Invalid token type', { processType: PROCESS_TYPE.AUTHENTICATE.GENERAL })
    }
    return generateTokenPromise(host, additionalPayload)
  }

  /**
   * @function generateToken remote method handler
   * @param {{@link TokenType}} tokenType token state
   * @param {boolean} isRefreshToken Whether it's a refresh token or new token
   * @param {object} req incoming request
   * @param {callback} cb callback to handle the response
   */
  Token.generateToken = (tokenType, isRefreshToken, req, cb) => {
    getToken(tokenType, isRefreshToken, req)
    .then((token) => {
      cb(null, token)
    })
    .catch((err) => {
      if (!err.logged) {
        logger.logIconError(err)
        err.logged = true
      }
      cb(err)
    })
  }

  /**
   * @function remoteMethodOptions return the options for the remote method
   * @param {{@link TokenType}} tokenType token state
   * @param {boolean} isRefreshToken Whether it's a refresh token or new token
   * @return {object} options for the remote method based on token type
   */
  function remoteMethodOptions (tokenType, isRefreshToken) {
    let path
    if (isRefreshToken) {
      path = `/refresh/${tokenType}`
    } else {
      path = `/${tokenType}`
    }
    return {
      http: {
        path: path,
        verb: 'get'
      },
      accepts: [
        {arg: 'tokenType', type: 'string', 'http': function (ctx) { return tokenType }},
        {arg: 'isRefreshToken', type: 'boolean', 'http': function (ctx) { return isRefreshToken }},
        {arg: 'req', type: 'object', 'http': {source: 'req'}}
      ],
      returns:
        { arg: 'token', type: 'string' }
    }
  }

  // Create '/token/session' API
  Token.remoteMethod('generateToken', remoteMethodOptions(TOKEN_TYPE.SESSION, !REFRESH_TOKEN))
  // Create '/token/submission' API
  Token.remoteMethod('generateToken', remoteMethodOptions(TOKEN_TYPE.SUBMISSION, !REFRESH_TOKEN))
  // Create '/token/refresh/session' API
  Token.remoteMethod('generateToken', remoteMethodOptions(TOKEN_TYPE.SESSION, REFRESH_TOKEN))
  // Create '/token/refresh/submission' API
  Token.remoteMethod('generateToken', remoteMethodOptions(TOKEN_TYPE.SUBMISSION, REFRESH_TOKEN))
}
