'use strict'
var session = require(`${__base}/server/models/yellowcard/authenticate/session`)
/**
 * AUTHENTICATE_MODELS
 *
 * @desc   This constant will wrapper the series of other models needed for the
 *         retrieval process (regarding client authentication process).
 *
 *         The other models are listed in the returned object as follows:
 *            AUTHENTICATE_MODELS:
 *            |__ Session:  --> function which creates a list object with the following attributes:
 *                  <Object>
 *                  |_ token:              (Session Token for retrieving a yellowcard)
 *                  |_ metaData:           (Object for storing meta data about the client requesting the yellowcard)
 *                      |_ phuName:        (Long form of the PHU who the client is requesting the yellowcard from)
 *                      |_ phuAcronym:     (Short form of the PHU who the client is requesting the yellowcard from)
 *                      |_ sessionId:      (Sessionid of the client who is requesting the yellowcard)
 *                      |_ clientIp:       (IP address of the user/client requesting the yellowcard)
 *                  |_ client:             (Object for storing information about the client requesting/on the yellowcard)
 *                      |_ oiid:           (Ontario Immunization Identifier)
 *                      |_ pin:            (Pin which co-insides with the Oiid above)
 *                      |_ relationship:   (Relationship to the patient on the Yellowcard)
 *
 * @param {list<functions>}    - list containing Retrieval;Authenticate models
 */
const AUTHENTICATE_MODELS = {
  Session: session
}

module.exports = AUTHENTICATE_MODELS
