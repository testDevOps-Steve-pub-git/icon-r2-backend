'use strict'

const archive = require('archiver')
const Promise = require('bluebird')
const WritableMemoryStream = require(`${__base}/server/services/writable-memory-stream-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const logger = require(`${__base}/server/services/logger-service`)

module.exports = (files) => {
  return new Promise((resolve, reject) => {
    if (files) {
      logger.logDebug(PROCESS_TYPE.GEO_IP, 'Zipping uploaded files.')
      var outputFileName = 'iconZip'

      var wstream = new WritableMemoryStream(outputFileName)
      var zipArchive = archive('zip', {})

      wstream.on('error', (err) => reject(err))
      zipArchive.on('error', (err) => reject(err))

      zipArchive.on('end', () => {
        wstream.end()
        resolve([wstream.getStreamData()[outputFileName], files.length])
      })

      zipArchive.pipe(wstream)
      files.forEach((file) => {
        zipArchive.append(file.content, { name: file.name })
        logger.logDebug(PROCESS_TYPE.SUBMISSION.ZIPPING, `Zipping ${file.name}.`)
      })
      zipArchive.finalize()
      logger.logDebug(PROCESS_TYPE.SUBMISSION.ZIPPING, 'Zipping completed.')
    } else {
      logger.logDebug(PROCESS_TYPE.SUBMISSION.ZIPPING, 'No files to zip.')
      resolve([undefined, 0])
    }
  })
}
