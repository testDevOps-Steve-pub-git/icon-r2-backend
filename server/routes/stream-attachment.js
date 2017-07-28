'use strict'

const Promise = require('bluebird')
const config = require(`${__base}/config`)
const processTypes = require(`${__base}/server/models/process-type`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const errorHandler = require(`${__base}/server/services/error-service`)
const copyFrom = require('pg-copy-streams').from
const crypto = require('crypto')
const uuid = require('uuid/v1')
const Meter = require('stream-meter')
const Busboy = require('busboy')

const metadata = {
  processType: processTypes.FILE_UPLOAD
}
const sqlCopy = 'COPY "Submission_Attachment"("Id", "Transaction_Id", "Original_Filename", "File_Mime_Type", "File_Content") FROM STDIN;'

function validMimeType (mimeType) {
  return config.attachment.types.includes(mimeType)
}

function createCipher (config) {
  return crypto
    .createCipher(config.algorithm, config.password)
    .setEncoding(config.fileEncoding)
}

// used by finally
let client
function disconnect () {
  client.release() // have to release the connection back to the pool
}

// used to prevent double res writing
let errorCaught = false

function getConnection (app) {
  return app.models.SubmissionAttachment.getConnector().pg.connect() // this is a promise
}

module.exports = (req, res, next) => {
  metadata.decoded = req.decoded

  return getConnection(req.app)
  .then((dbClient) => {
    client = dbClient
    return new Promise((resolve, reject) => {
      try {
        const cipher = createCipher(config.crypto)
        const stream = client.query(copyFrom(sqlCopy))
        const busboy = new Busboy({ headers: req.headers })
        const meter = new Meter(config.attachment.size)

        let fileEnded = false

        stream.on('error', (err) => {
          let reason = err.message.split(':')[0]
          let handler = reason ? errorHandler.IconCustomWarning : errorHandler.IconCustomError

          reject(handler(err.message, { statusCode: statusCodes[reason] }))
        })

        req.on('error', reject)
        busboy.on('error', reject)

        // If the file upload format is invalid, file end will not
        // fire and the stream will not end.  Busboy finish will always
        // fire even if the file is invalid so check for file completion
        busboy.on('finish', () => {
          if (!fileEnded) { reject(errorHandler.IconCustomError('Invalid file upload')) }
        })

        // limit upload to max file size
        meter.on('error', () => {
          reject(errorHandler.IconCustomWarning('File size exceeded', {
            statusCode: statusCodes.PAYLOAD_TOO_LARGE
          }))
        })

        // process the file
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          file.on('error', reject)
          file.on('end', () => { fileEnded = true })

          // check mime type
          if (!validMimeType(mimetype)) {
            reject(errorHandler.IconCustomWarning('Invalid Mime Type', {
              statusCode: statusCodes.UNSUPPORTED_MEDIA_TYPE
            }))
          }

          // stream the data
          try {
            stream.write(`${uuid()}\t`)
            stream.write(`${req.decoded.txId}\t`)
            stream.write(`${filename}\t`)
            stream.write(`${mimetype}\t`)

            file
            .pipe(meter)
            .pipe(cipher)
            .pipe(stream)
          } catch (err) {
            reject(err)
          }
        })

        // all done!
        stream.on('end', () => {
          if (!errorCaught) {
            res.writeHead(200, { 'Connection': 'close' })
            res.end('OK')
            resolve(client)
          }
        })

        // pipe request -> busboy -> stream
        req.pipe(busboy)
      } catch (err) {
        reject(err)
      }
    })
  })
  .catch((err) => {
    errorCaught = true
    Object.assign(err, metadata)
    err.statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR
    err.stack = null
    next(err)
  })
  .finally(disconnect)
}
