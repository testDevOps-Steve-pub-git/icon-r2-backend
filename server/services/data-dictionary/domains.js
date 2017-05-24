'use strict'

const copyFrom = require('pg-copy-streams').from
const request = require('request')
const Promise = require('bluebird')
const config = require(`${__base}/config.js`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const replace = require('stream-replace')

function importDomain (client, domain) {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, `Importing ${domain.dictionary} from ${config.dataDictionary.dhir.uri}${domain.dictionary}`)
  return new Promise((resolve, reject) => {
    let stream = client.query(copyFrom(`COPY ${domain.table} FROM STDIN;`))

    let req = request({
      url: `${config.dataDictionary.dhir.uri}${domain.dictionary}`,
      headers: {
        'content-type': 'application/json'
      }
    })
    req.on('error', reject)
    req.on('response', (response) => {
      // request is not throwing an error for non-200 response so catch it here
      if (response.statusCode !== 200) {
        let err = new Error(`Data Dictionary request rejected with ${response.statusCode}`)
        err.statusCode = response.statusCode
        reject(err)
      }
    })
    stream.on('error', reject)
    stream.on('end', resolve)
    req.pipe(replace(/\\"/g, "'")).pipe(stream)
  })
}

module.exports = (client) => {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Importing domains')
  return Promise.map(config.dataDictionary.domains, (domain) => {
    return importDomain(client, domain)
      .then(() => {
        logger.logInfo(PROCESS_TYPE.DATA_DICT, `Imported ${domain.dictionary} from ${config.dataDictionary.dhir.uri}${domain.dictionary}`)
      })
  })
  .then(() => { return client })
}
