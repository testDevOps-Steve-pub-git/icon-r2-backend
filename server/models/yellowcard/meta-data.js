'use strict'
/**
   * Creates List of MetaData
   * @param  {string}  phuName      - the phu long form of the name (e.g. 'Grey Bruce Public Health Unit')
   * @param  {string}  phuAcronym   - the phu short form of the name (e.g. 'GBHU')
   * @param  {string}  sessionId    - the string representation of the session id referencing the client requesting their yellowcard
   * @param  {string}  clientIp     - the string representation of the ip referencing the client requesting their yellowcard
   * @return {list}                 - list of meta data attributes for logging (generated from the request object)
   * ===================================================================================================================================
   */
function MetaData (phuName, phuAcronym, sessionId, clientIp) {
  return {
    phuName: phuName,              // ==> PHU Full Name
    phuAcronym: phuAcronym,        // ==> PHU Shortform
    sessionId: sessionId,          // ==> User Session ID
    clientip: clientIp             // ==> User's IP
  }
}

module.exports = MetaData
