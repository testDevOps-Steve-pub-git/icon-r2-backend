'use strict'

const schedule = require('node-schedule')
const config = require(`${__base}/config`)
const auditor = require(`${__base}/server/logger`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

function scheduleOptions (options) {
  return `* ${options.minute} ${options.hour} ${options.day} */${config.frequencyInMonths} *`
}

function enable () {
  // only enable if we are not in test mode, are consumer or both, and this service is enabled in the config
  return process.env.NODE_ENV !== 'test' && (config.serverType === '2' || config.serverType === '3') && config.dataDictionary.enabled
}

module.exports = (app) => {
  if (!enable()) return

  let options = scheduleOptions(config.dataDictionary.schedule)
  logger.logDebug(PROCESS_TYPE.DATA_DICT, `Scheduling data dictionary updates`)

  schedule.scheduleJob(options, () => {
    require(`${__base}/server/services/data-dictionary`)()
    .then(() => {
      auditor.auditLogBackend(PROCESS_TYPE.DATA_DICT, 'Data dictionary imported successfully')
    })
    .catch((err) => {
      err.message = `Data dictionay import failed. Aborted. ${err.message}`
      logger.logError(PROCESS_TYPE.DATA_DICT, err)
    })
  })
}
