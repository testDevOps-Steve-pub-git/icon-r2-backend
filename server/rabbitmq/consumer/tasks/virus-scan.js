'use strict'

var Promise = require('bluebird')
var config = require(`${__base}/config`).clamav
const virusScanner = require(`${__base}/server/services/http-virus-scanner`)
const logger = require(`${__base}/server/logger`)
const processTypes = require(`${__base}/server/models/process-type`)

const metadata = {
  processType: processTypes.SUBMISSION.VIRUS_SCAN
}

function scan (file) {
  logger.debug('Scanning file for viruses', metadata)

  return virusScanner(file.content, config)
  .then(() => {
    logger.debug('File scanned and no viruses found', metadata)
    return file
  })
  .catch((err) => {
    logger.debug(`Virus found. Cleansed file. ${err}`, metadata)
    throw err
  })
}

function cleanse (file) {
  return {
    content: Buffer.from('Uploaded file contained a virus. Contents removed.'),
    name: `${file.name}.found-virus.txt`
  }
}

module.exports = (files = []) => {
  if (!config.enabled) { return files }

  return Promise.map(files, (file) => {
    return scan(file)
    .catch(() => cleanse(file))
  })
}
