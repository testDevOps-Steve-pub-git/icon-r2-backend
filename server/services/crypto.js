'use strict'

const crypto = require('crypto')
const Promise = require('bluebird')
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}

/**
 * @function encrypt Encrypt the buffer data
 * @param {Buffer} buffer - Represent the buffer data which needs to be encrypted
 * @param {Object} config - Contains the algorithm and password used for encryption
 * @return {Promise<Buffer>} - Promise to the encrypted buffer
 */
function encrypt (buffer, config) {
  return new Promise((resolve, reject) => {
    try {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Encrypting data')
      const cipher = crypto.createCipher(config.algorithm, config.password)
      let crypted = cipher.update(buffer)
      crypted = Buffer.concat([ crypted, cipher.final() ])

      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Data encrypted')
      resolve(crypted)
    } catch (err) {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Data encryption failed')
      reject(err)
    }
  })
}

/**
 * @function decrypt Decrypt the buffer data
 * @param {Buffer} buffer - Represent the buffer data which needs to be decrypted
 * @param {Object} config - Contains the algorithm and password used for decryption
 * @return {Promise<Buffer>} - Promise to the decrypted buffer
 */
function decrypt (buffer, config) {
  return new Promise((resolve, reject) => {
    try {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Decrypting data')
      const decipher = crypto.createDecipher(config.algorithm, config.password)
      let dec = decipher.update(buffer)
      dec = Buffer.concat([ dec, decipher.final() ])

      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Data decrypted')
      resolve(dec)
    } catch (err) {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.CRYPTO, 'Data decryption failed')
      reject(err)
    }
  })
}
