'use strict'

/**
 * @module guid-service
 */
module.exports = guidService()

/**
 * @function guidService Generate GUID
 * @return {{function} base64Guid Return the GUID in base64
 *          {function} base31Guid Return the GUID in base31}
 */
function guidService () {
  /**
   * @function generateGuid generates a GUID using the current timestamp and a random number between 0 and 1000
   * @param {String} characterSet Represent the character set used for creating GUID
   * @return {String} GUID
   */
  function generateGuid (characterSet) {
    var characterSetLength = characterSet.length

    function getChars (num, res) {
      var mod = num % characterSetLength
      var remaining = Math.floor(num / characterSetLength)
      var chars = characterSet.charAt(mod) + res

      if (remaining <= 0) {
        return chars
      }
      return getChars(remaining, chars)
    }

    // converting number to radix3
    function base (value) {
      if (typeof (value) === 'number') {
        return getChars(value, '')
      }

      if (typeof (value) === 'string') {
        if (value === '') {
          return NaN
        }
        return value.split('').reverse().reduce(function (prev, cur, i) {
          return prev + characterSet.indexOf(cur) * Math.pow(characterSetLength, i)
        }, 0)
      }
    }

    // End of conversion of number to radix31
    return base(new Date().getTime() + (Math.random() * 1000))
  }

  /**
   * @function getBase64Guid generates a base64 GUID using the current timestamp and a random number between 0 and 1000
   * @return {String} base64 GUID
   */
  function getBase64Guid () {
    var base64Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    return generateGuid(base64Chars)
  }

  /**
   * @function getBase31Guid generates a base31 GUID using the current timestamp and a random number between 0 and 1000
   * Base31 will have capital letters and number except 0, O, 1, I, L which are potential problems
   * @return {String} base31 GUID
   */
  function getBase31Guid () {
    // 0, O, 1, I, L ------ Removing potential problems
    var base31Chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
    return generateGuid(base31Chars)
  }

  return {
    base64Guid: getBase64Guid,
    base31Guid: getBase31Guid
  }
}
