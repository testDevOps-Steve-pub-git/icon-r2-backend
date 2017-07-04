'use strict'

const archive = require('archiver')
const Promise = require('bluebird')
const WritableMemoryStream = require(`${__base}/server/services/writable-memory-stream-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const logger = require(`${__base}/server/logger`)

module.exports = (files) => {
  return new Promise((resolve, reject) => {
    if (files) {
      logger.debug('Zipping uploaded files.', { processType: PROCESS_TYPE.SUBMISSION.ZIPPING })
      const outputFileName = 'iconZip'

      const wstream = new WritableMemoryStream(outputFileName)
      const zipArchive = archive('zip', {})

      wstream.on('error', (err) => reject(err))
      zipArchive.on('error', (err) => reject(err))

      zipArchive.on('end', () => {
        wstream.end()
        resolve([wstream.getStreamData()[outputFileName], files.length])
      })

      zipArchive.pipe(wstream)
      files.forEach((file) => {
        zipArchive.append(file.content, { name: file.name })
        logger.debug(`Zipping ${file.name}`, { processType: PROCESS_TYPE.SUBMISSION.ZIPPING })
      })
      zipArchive.finalize()
      logger.debug('Zipping completed', { processType: PROCESS_TYPE.SUBMISSION.ZIPPING })
    } else {
      logger.debug('No files to zip', { processType: PROCESS_TYPE.SUBMISSION.ZIPPING })
      resolve([undefined, 0])
    }
  })
}
