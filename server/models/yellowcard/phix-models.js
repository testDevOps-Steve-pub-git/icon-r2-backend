'use strict'

const patientPathUri = require(`${__base}/server/models/yellowcard/phix/patient-uri`)   // --> For validating yellocard request
const headers = require(`${__base}/server/models/yellowcard/phix/phix-headers`)         // --> For validating yellocard request

/**
 *  PHIX_MODELS
 *  @desc   This constant will contain the needed models for the
 *          phix retrieval process.
 *
 *          Within this list will be functions to help form the:
 *          |__ 1) Patient Path uri for retrieving from phix
 *          |__ 2) Headers for retrieving from phix
 *
 *  @return {list<object>}    - list containing the function needed
 *                              for modeling the request from phix
 */
const PHIX_MODELS = {
  PATIENT_PATH_URI: patientPathUri,
  HEADERS: headers
}

module.exports = PHIX_MODELS
