'use strict'

 /**
  * @constant TOKEN_MESSAGES
  * @type {String[]} - Success or Error Messages
  */
const TOKEN_MESSAGES = {
  UNAUTH_ACCESS: 'Unauthorized Access',
  FAIL_AUTH_TOKEN: 'failed to authenticate token',
  INVALID_TRANS_ID: 'invalid transaction id',
  NO_TOKEN: 'token not provided',
  NO_TRANS_ID: 'transaction id not provided',
  INVALID_TOKEN_TYPE: 'invalid token type',
  NO_TOKEN_TYPE: 'missing token type',
  INVALID_SESSION_ID: 'invalid session id',
  NO_SESSION_ID: 'session id not provided'
}

/**
 * @module token-messages
 * @return {TOKEN_MESSAGES} Token success or error messages
 */
module.exports = TOKEN_MESSAGES
