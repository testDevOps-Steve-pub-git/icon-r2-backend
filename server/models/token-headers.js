/**
 * @function getHost return the host url from the headers
 * @param {Object} headers represents request headers
 * @return {string} host url
 */
function getHost (headers) {
  return headers.origin ||
         headers.hostname || // hostname is being passed from NGINX as host value
         headers.referer ||
         headers.host
}

/**
 * @function getSessionToken return the session token value from the headers
 * @param {Object} headers represents request headers
 * @return {string} session token
 */
function getSessionToken (headers) {
  return headers['session-token']
}

/**
 * @function getSubmissionToken return the submission token value from the headers
 * @param {Object} headers represents request headers
 * @return {string} submission token
 */
function getSubmissionToken (headers) {
  return headers['submission-token'] ||
         headers['x-access-token'] // x-access-token header added for backward compatibility
}

/**
 * @function getIp return the ip address of the client if available otherwise returns empty string
 * @param {Object} headers represents request headers
 * @return {string} ip address of the client
 */
function getIp (headers) {
  return headers['x-real-ip'] || ''
}

/**
 * @module token-headers
 * @return {{function} getHost return the host url from the headers,
 *          {function} getSessionToken return the session token value from the headers,
 *          {function} getSubmissionToken return the submission token value from the headers,
 *          {function} getIp return the ip address of the client}
 */
module.exports = {
  getHost: getHost,
  getSessionToken: getSessionToken,
  getSubmissionToken: getSubmissionToken,
  getIp: getIp
}
