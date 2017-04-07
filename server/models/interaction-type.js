'use strict'

/**
 * This is a list of valid interaction types being performed by the server {retrieval, or submission}
 * @constant INTERACTION_TYPE
 * @type   {list<string>}
 * @return {list<string>}   - contains the interaction type being performed by the server
 * ==================================================================================================
 */
const INTERACTION_TYPE = {
  SUBMISSION: 'submission',
  RETRIEVAL: 'retrieval'
}

module.exports = INTERACTION_TYPE
