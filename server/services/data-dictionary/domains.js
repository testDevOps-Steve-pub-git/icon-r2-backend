'use strict'

const copyFrom = require('pg-copy-streams').from
const request = require('request')
const Promise = require('bluebird')
const config = require(`${__base}/config.js`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

function importDomain (client, domain) {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, `Importing ${domain.dictionary} from ${config.dataDictionary.dhir.uri}${domain.dictionary}`)
  return new Promise((resolve, reject) => {
    let stream = client.query(copyFrom(`COPY ${domain.table} FROM STDIN;`))

    let req = request(`${config.dataDictionary.dhir.uri}${domain.dictionary}`)
    req.on('error', reject)
    req.pipe(stream)
       .on('error', reject)
       .on('end', resolve)
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
