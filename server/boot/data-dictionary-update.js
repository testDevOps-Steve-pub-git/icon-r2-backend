'use strict'

const schedule = require('node-schedule')
const config = require(`${__base}/config`)
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const Cron = require('cron-converter')

function scheduleOptions (options) {
  return `${options.minute || '*'} ${options.hour || '*'} ${options.day || '*'} ${options.month || '*'} *`
}

function enable () {
  // only enable if we are not in test mode, are consumer or both, and this service is enabled in the config
  return process.env.NODE_ENV !== 'test' && (config.serverType === '2' || config.serverType === '3') && config.dataDictionary.enabled
}

module.exports = (app) => {
  if (!enable()) return

  let options = scheduleOptions(config.dataDictionary.schedule)
  let nextRun = new Cron().fromString(options).schedule().next()   // get the next scheduled run

  logger.debug(`Scheduling data dictionary updates. Next run at ${nextRun}`, { processType: PROCESS_TYPE.DATA_DICT })
  schedule.scheduleJob(options, () => {
    require(`${__base}/server/services/data-dictionary`)()
    .then(() => {
      logger.auditLogBackend(PROCESS_TYPE.DATA_DICT, 'Data dictionary imported successfully')
    })
    .catch((err) => {
      err.message = `Data dictionay import failed. Aborted. ${err.message}`
      logger.error(err.message, { processType: PROCESS_TYPE.DATA_DICT })
    })
    .finally(() => {
      nextRun = new Cron().fromString(options).schedule().next()   // get the next scheduled run
      logger.debug(`Scheduling data dictionary update. Next run at ${nextRun}`, { processType: PROCESS_TYPE.DATA_DICT })
    })
  })
}
