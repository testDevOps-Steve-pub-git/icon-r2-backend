'use strict'

const crypto = require('crypto')

/**
 * @vmodule guid-service
 */
module.exports = guidService()

/**
 * @function guidService Generate GUID
 * @return {{function} base64Guid Return the GUID in base64
 *          {function} base31Guid Return the GUID in base31}
 */
function guidService () {
  /**
   * @function generateGuid generates a GUID using cryptographic methods
   * @param {String} characterSet Represent the character set used for creating GUID
   * @return {String} GUID */
  function generateGuid (chars, howMany = 9) {
    var rnd = crypto.randomBytes(howMany)
    var value = new Array(howMany)
    var len = chars.length

    for (var i = 0; i < howMany; i++) {
      value[i] = chars[rnd[i] % len]
    };

    return value.join('')
  }

  /**
   * @function getBase64Guid generates a base64 GUID using the current timestamp and a random number between 0 and 1000
   * @return {String} base64 GUID
   */
  function getBase64Guid () {
    const base64Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    return generateGuid(base64Chars)
  }

  /**
   * @function getBase31Guid generates a base31 GUID using the current timestamp and a random number between 0 and 1000
   * Base31 will have capital letters and number except 0, O, 1, I, L which are potential problems
   * @return {String} base31 GUID
   */
  function getBase31Guid () {
    // 0, O, 1, I, L ------ Removing potential problems
    const base31Chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
    return generateGuid(base31Chars)
  }

  return {
    base64Guid: getBase64Guid,
    base31Guid: getBase31Guid
  }
}
