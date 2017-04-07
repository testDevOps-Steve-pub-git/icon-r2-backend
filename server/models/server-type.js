'use strict'

/**
 * @typedef {Object} SERVER_TYPE
 * @property {string} [PUBLISHER=1]  Publisher state
 * @property {string} [CONSUMER=2]  Consumer state
 * @property {string} [BOTH=2]  Both publisher and consumer state
 */

 /**
  * @constant SERVER_TYPE
  * @type {SERVER_TYPE}
  */
const SERVER_TYPE = {
  NONE: '0',
  PUBLISHER: '1',
  CONSUMER: '2',
  BOTH: '3'
}

/**
 * @module server-type
 * @return {SERVER_TYPE} Server type
 */
module.exports = SERVER_TYPE
