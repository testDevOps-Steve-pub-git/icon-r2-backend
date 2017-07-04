'use strict'
// Generic Models
const STATUS_CODES = require(`${__base}/server/models/response-status-code`)    // --> For list of generic response status codes
const LOG_LEVELS = require(`${__base}/server/models/log-level`)                 // --> For list of generic logging levels
const PROCESS_TYPES = require(`${__base}/server/models/process-type`)           // --> For list of generic process types
const INTERACTION_TYPES = require(`${__base}/server/models/interaction-type`)   // --> For list of generic interaction types
const MESSAGES = require(`${__base}/server/models/yellowcard/messages`)         // --> For list of specific retrieval messages
const META_DATA = require(`${__base}/server/models/yellowcard/meta-data`)       // --> For list of Meta data attributes for logging

// Specialized Models
const AUTHENTICATE_MODELS = require(`${__base}/server/models/yellowcard/authenticate-models`)   // --> For validating yellocard request
const PHIX_MODELS = require(`${__base}/server/models/yellowcard/phix-models`)                           // --> For validating yellocard request

/**
 * YELLOWCARD_MODELS
 *
 * @desc   This constant will wrapper the series of other models needed for the
 *         retrieval process (regarding client requested yellowcards).
 *
 *         The other models are listed in the returned object as follows:
 *            YELLOWCARD_MODELS:
 *            |__ AUTHENTICATE:          --> LIST<List<String>>
 *            |__ TYPES                  --> LIST<LIST<STRING>>
 *                |__ PROCESSES          --> LIST<STRING>
 *                |__ INTERACTIONS       --> LIST<STRING>
 *            |__ STATUS_CODES           --> LIST<INTEGER>
 *            |__ LOG
 *                |__ LEVELS             --> LIST<STRING>
 *                |__ META_DATA          --> LIST<STRING>
 *            |__ MESSAGES               --> LIST<STRING>
 *
 *
 * @param {list<functions>}    - list containing yellowcard service functions
 */
const YELLOWCARD_MODELS = {
  AUTHENTICATE: AUTHENTICATE_MODELS,
  PHIX: PHIX_MODELS,
  TYPES: {
    PROCESSES: PROCESS_TYPES.RETRIEVAL,
    INTERACTIONS: INTERACTION_TYPES
  },
  LOG: {
    LEVELS: LOG_LEVELS,
    META_DATA: META_DATA
  },
  STATUS_CODES: STATUS_CODES,
  LOG_LEVELS: LOG_LEVELS,
  MESSAGES: MESSAGES
}

module.exports = YELLOWCARD_MODELS
