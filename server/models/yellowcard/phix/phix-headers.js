'use strict'
var config = require(`${__base}/config`)

/**
 *  phixHeaders()
 *
 *  @desc   This function will create and return a list object containing
 *          the phix headers for yellowcard retrieval
 *
 *  @param {string} pin     - the pin used for unlocking the retrieval request
 *  @param {string} token   - the token to authorize the retrieval from phix
 *  @return {list<string>}  - the list containing all attributes for the phix headers
 */
function phixHeaders (pin, token) {
  return ({
    'Accept': 'application/json',                                         // indicates type of message to be returned
    'Immunizations_Context': pin,                                         // Included for every GET request
    'Submission_Context': 'Bearer ' + token,                              // Previously ICONTransactionToken
    'Channel_Context': 'Bearer ' + config.phixEndpoint.retrieval.token   // Previously JWT
  })
}

module.exports = phixHeaders
