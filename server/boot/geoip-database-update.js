'use strict'

const geoip = require('geoip-lite')
const schedule = require('node-schedule')
const geoipConfig = require(`${__base}/config`).geoip
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

function enable () {
  // only enable if we are not in test mode and this service is enabled in the config
  return process.env.NODE_ENV !== 'test' && geoipConfig.enable
}

module.exports = function (app) {
  if (!enable()) return

  const geoDatabaseUpdate = geoipConfig.databaseUpdate
  const scheduleJobOptions = {
    date: geoDatabaseUpdate.dayOfMonth,
    hour: geoDatabaseUpdate.hour,
    minute: geoDatabaseUpdate.minute
  }
  // Automatically run the task
  schedule.scheduleJob(scheduleJobOptions, () => {
    // Enabling the data watcher to automatically update its geo data without a restart
    // refresh in-memory geo data when a file changes in the data directory
    geoip.startWatchingDataUpdate()
    // Fork the process as updating the database exits after it finishes
    // which will keep the main process running without stopping
    const fork = require('child_process').fork
    // Update the geoip database file
    logger.debug('Forking process to update Geo IP database.', { processType: PROCESS_TYPE.GEO_IP })
    logger.auditLogBackend(PROCESS_TYPE.GEO_IP, 'Updating Geo IP database')
    fork('./node_modules/geoip-lite/scripts/updatedb.js', [], {
      detached: false,
      cwd: __base
    })
  })
}
