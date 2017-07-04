'use strict'

/**
 * YellowCardModels.authenticate: Client() Method
 *
 * @desc   This function will create a client model for storing the following
 *         atrributes before retrieving a valid yellowcard:
 *            1) Oiid:          (Ontario Immunization Identifier)
 *            1) Pin:           (Pin which co-insides with the Oiid above)
 *            1) Relationship:  (Relationship to the patient on the Yellowcard)
 *
 * @param {string}  oiid            - ontario immunization identifier
 * @param {string}  pin             - encrypted pin for oiid
 * @param {string}  relationship  - relationship to the patient on the yellowcard
 * @param {string}  relationship  - language culture of the client requesting the yellowcard
 */
function Client (oiid, pin, relationship, language) {
  return ({
    oiid: oiid,
    pin: pin,
    relationship: relationship,
    language: language
  })
}

module.exports = Client
