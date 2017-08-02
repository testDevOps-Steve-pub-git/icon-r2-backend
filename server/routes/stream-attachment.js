'use strict'

const Promise = require('bluebird')
const copyFrom = require('pg-copy-streams').from
const crypto = require('crypto')
const uuid = require('uuid/v1')
const Meter = require('stream-meter')
const Busboy = require('busboy')

const config = require(`${__base}/config`)
const processTypes = require(`${__base}/server/models/process-type`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const errorHandler = require(`${__base}/server/services/error-service`)

require('require-sql')
const COPY_FROM_STDIN = require(`${__base}/db/copy-stream-from-stdin.sql`)
const META_DATA = { processType: processTypes.FILE_UPLOAD }

/** Determines if a MIME type is permitted.
 * @param {String} mimeType
 * @returns {Boolean} */
const isValidMimeType = (mimeType) => config.attachment.types.includes(mimeType)

/** @param {Object} config @returns {Object} - the instantiated cipher */
const createCipher = (config) => crypto
      .createCipher(config.algorithm, config.password)
      .setEncoding(config.fileEncoding)

/** Gets a connection from the pool used by loopback middleware.
 * @param {Object} app - the loopback app to consume connection pool from
 * @returns {Promise<Object>} - a client from the pool */
const getConnection = (app) => app.models.SubmissionAttachment
      .getConnector().pg.connect()

/** Releases the client connection back to the pool. @param {Object} client */
const releaseConnection = (client) => client.release()

module.exports = (req, res, next) => {
  META_DATA.decoded = req.decoded
  let client = null // used by finally
  let errorCaught = false // used to prevent double res writing

  return getConnection(req.app)
  .then((dbClient) => { client = dbClient })
  .then(() => new Promise((resolve, reject) => {
    try {
      const cipher = createCipher(config.crypto)
      const queryStream = client.query(copyFrom(COPY_FROM_STDIN))
      const busboy = new Busboy({ headers: req.headers })
      const meter = new Meter(config.attachment.size)

      let fileEnded = false

      // Busboy is at the top of the file processing tree.
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('error', reject)
        file.on('end', () => { fileEnded = true })

        // check mime type
        if (!isValidMimeType(mimetype)) {
          reject(errorHandler.IconCustomWarning('Invalid Mime Type', {
            statusCode: statusCodes.UNSUPPORTED_MEDIA_TYPE
          }))
        }

        // stream the data
        try {
          queryStream.write(`${uuid()}\t`)
          queryStream.write(`${req.decoded.txId}\t`)
          queryStream.write(`${filename}\t`)
          queryStream.write(`${mimetype}\t`)

          file.pipe(meter)
          .pipe(cipher)
          .pipe(queryStream)
        } catch (err) {
          reject(err)
        }
      })

      busboy.on('error', reject)

      busboy.on('finish', () => {
        // If the file upload format is invalid, file end will not
        // fire and the stream will not end. Busboy finish will always
        // fire even if the file is invalid so check for file completion
        if (!fileEnded) reject(errorHandler.IconCustomError('Invalid file upload!'))
      })

      // Meter limits the upload to a max file size.
      meter.on('error', () => {
        reject(errorHandler.IconCustomWarning('File size exceeded!', {
          statusCode: statusCodes.PAYLOAD_TOO_LARGE
        }))
      })

      // all done!
      queryStream.on('end', () => {
        if (!errorCaught) {
          res.writeHead(200, { 'Connection': 'close' })
          res.end('OK')
          if (client) releaseConnection(client)
          resolve()
        }
      })

      queryStream.on('error', (err) => {
        let [ reason ] = err.message.split(':')
        let handler = reason
            ? errorHandler.IconCustomWarning
            : errorHandler.IconCustomError

        reject(handler(err.message, { statusCode: statusCodes[reason] }))
      })

      req.on('error', reject)

      // pipe request -> busboy -> stream
      req.pipe(busboy)
    } catch (err) {
      if (client) releaseConnection(client)
      reject(err)
    }
  }))
  .catch((err) => {
    errorCaught = true
    Object.assign(err, META_DATA)
    err.statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR
    err.stack = null
    next(err)
  })
}
