'use strict'

const authRequest = require(`${__base}/server/routes/yellowcard/authenticate-request`)
const phixRequest = require(`${__base}/server/routes/yellowcard/phix-retrieval`)

/**
 *  YellocardRouter()
 *
 *  @desc   This function outlines the routes regarding yellowcard retrieval
 *
 *  @return {Object}      - Object containing functions required to complete a yellowcard retrieval
 */
function YellowcardRouter () {
  return ({
    authenticateRequest: authRequest,
    requestFromPhix: phixRequest
  })
}

module.exports = YellowcardRouter()
