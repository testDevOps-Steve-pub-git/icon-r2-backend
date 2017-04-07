'use strict'

var tokenHeaders = require(`${__base}/server/models/token-headers`)

/**
 * @function getCommonPayload create common payload from decoded token
 * @param {Object} decodedToken represents decoded object of the token
 * @param {Object} headers represents the request headers
 * @return {Object} common payload object
 */
function getCommonPayload (decodedToken, headers) {
  return {
    phuName: decodedToken.phuName,
    phuId: decodedToken.phuId,
    phuAcronym: decodedToken.phuAcronym,
    clientip: tokenHeaders.getIp(headers),
    originalIat: decodedToken.originalIat || decodedToken.iat // Needed for Refresh Token. Do not interchange it.
  }
}

/**
 * @function CreateSessionPayload create session payload from decoded token
 * @param {Object} decodedToken represents decoded object of the token
 * @param {Object} headers represents the request headers
 * @return {Object} session payload object
 */
function CreateSessionPayload (decodedToken, headers) {
  return Object.assign({
    sessionId: decodedToken.sessionId,
    sessionToken: tokenHeaders.getSessionToken(headers)
  }, getCommonPayload(decodedToken, headers))
}

/**
 * @function CreateSubmissionPayload create submission payload from decoded token
 * @param {Object} decodedToken represents decoded object of the token
 * @param {Object} headers represents the request headers
 * @return {Object} submission payload object
 */
function CreateSubmissionPayload (decodedToken, headers) {
  var tokenId = decodedToken.submissionId || decodedToken.txId // txId added for backward compatibility
  var token = tokenHeaders.getSubmissionToken(headers)

  return Object.assign({
    submissionId: tokenId,
    submissionToken: token,
    txId: tokenId, // Added for backward compatibility
    token: token // Added for backward compatibility
  }, getCommonPayload(decodedToken, headers))
}

/**
 * @module token-decode-payload
 * @return {{function} CreateSessionPayload create session payload from decoded token,
 *          {function} CreateSubmissionPayload create submission payload from decoded token}
 */
module.exports = {
  CreateSessionPayload: CreateSessionPayload,
  CreateSubmissionPayload: CreateSubmissionPayload
}
