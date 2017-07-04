'use strict'

/**
 *  patientPathUri()
 *
 *  @desc   This function will create the patient path uri for the phix endpoint request
 *
 *  @param  {string}  oiid  - the ontario immunization identifier used for the yellowcard retrieval
 *  @return {string}        - the string containing the uri for the phix retrieval
 */
function patientPathUri (oiid) {
  return (
    `?patient.identifier=http://ca-on-panorama-immunization-id|${oiid}&_include=Immunization:patient&_include=Immunization:performer&_include:recurse=Practitioner:organization&_revinclude:recurse=ImmunizationRecommendation:patient&_format=application/json`
  )
}

module.exports = patientPathUri
