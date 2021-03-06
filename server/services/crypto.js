'use strict'

const crypto = require('crypto')
const Promise = require('bluebird')
const logger = require(`${__base}/server/logger`)
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
      logger.debug('Encrypting data', { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
      const cipher = crypto.createCipher(config.algorithm, config.password)
      let crypted = cipher.update(buffer)
      crypted = Buffer.concat([ crypted, cipher.final() ])

      logger.debug('Data encrypted', { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
      resolve(crypted)
    } catch (err) {
      logger.debug('Data encryption failed', { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
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
function decrypt (buffer, config, encoding = null) {
  return new Promise((resolve, reject) => {
    try {
      logger.debug(`Decrypting data ${encoding}`, { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
      const decipher = crypto.createDecipher(config.algorithm, config.password)

      let data = encoding ? buffer.toString() : buffer // only encrypted files use encoding
      let dec = decipher.update(data, encoding) // encoding for files not buffers

      dec = Buffer.concat([ dec, decipher.final() ])

      logger.debug('Data decrypted', { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
      resolve(dec)
    } catch (err) {
      logger.debug('Data decryption failed', { processType: PROCESS_TYPE.SUBMISSION.CRYPTO })
      reject(err)
    }
  })
}
