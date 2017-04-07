'use strict'
var authService = require(`${__base}/server/services/yellowcard/authenticate-service`)      // --> authenticate request service functions
var phixService = require(`${__base}/server/services/yellowcard/phix-service`)              // --> phix retrieval service functions
var errorService = require(`${__base}/server/services/yellowcard/error-service`)            // --> error service functions

/**
 * YellowCardService() Method
 *
 * @desc   This function will wrapper the series of other services needed for the
 *         retrieval process (regarding client requested yellowcards).
 *
 *         The other services are listed in the returned object as follows:
 *            YellowcardService:
 *            |__ authenticate
 *            |__ phix
 *            |__ parse
 *            |__ lookups
 *            |__ error
 *
 *
 * @param {list<functions>}    - list containing yellowcard service functions
 */
function YellowcardService () {
  return ({
    authenticate: authService,
    phix: phixService,
    error: errorService
  })
}

module.exports = YellowcardService()
