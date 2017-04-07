'use strict'
var MetaData = require(`${__base}/server/models/yellowcard/meta-data`)           // --> Models Logging
var Client = require(`${__base}/server/models/yellowcard/authenticate/client`)   // --> Models Client info

/**
 * YellowCardModels.authenticate: Session() Method
 *
 * @desc   This function will create a session model for storing the following
 *         atrributes before retrieving a valid yellowcard:
 *            1) token:                 (Session Token for retrieving a yellowcard)
 *            2) metaData:              (Object for storing meta data about the client requesting the yellowcard)
 *               |__ phuName:           (Long form of the PHU who the client is requesting the yellowcard from)
 *               |__ phuAcronym:        (Short form of the PHU who the client is requesting the yellowcard from)
 *               |__ sessionId:         (Sessionid of the client who is requesting the yellowcard)
 *               |__ clientIp:          (IP address of the user/client requesting the yellowcard)
 *            3) client:                (Object for storing information about the client requesting/on the yellowcard)
 *               |__ oiid:              (Ontario Immunization Identifier)
 *               |__ pin:               (Pin which co-insides with the Oiid above)
 *               |__ relationship:      (Relationship to the patient on the Yellowcard)
 *               |__ language:          (language culture of the client requesting the yellowcard)
 *            4) fhirMessage:           (Object for storing the fhir message response from PHIX)
 *
 * @param {string}  sessionId          - Unique identifier for the client's session
 * @param {string}  clientIp            - IP address of the client requesting the yellowcard
 * @param {string}  token              - token of the client requesting the yellowcard
 * @param {string}  oiid                 - ontario immunization identifier
 * @param {string}  pin                 - encrypted pin for oiid
 * @param {string}  relationship      - relationship to the patient on the yellowcard
 * @param {string}  language         - language culture of the client requesting the yellowcard
 */
function Session (sessionId, clientIp, token, phuName, phuAcronym, oiid, pin, relationship, language) {
  return ({
    token: token,
    metaData: new MetaData(phuName, phuAcronym, sessionId, clientIp),
    client: new Client(oiid, pin, relationship, language)
  })
}

module.exports = Session
