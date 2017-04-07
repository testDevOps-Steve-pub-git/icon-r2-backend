'use strict'

/**
 * @typedef {Object} TOKEN_TYPE
 * @property {string} [SESSION=session]  Session state
 * @property {string} [SUBMISSION=submission]  Submission state
 */

 /**
  * @constant TOKEN_TYPE
  * @type {TOKEN_TYPE}
  */
const TOKEN_TYPE = {
  SESSION: 'session',
  SUBMISSION: 'submission'
}

/**
 * @module token-type
 * @return {TOKEN_TYPE} Token type
 */
module.exports = TOKEN_TYPE
