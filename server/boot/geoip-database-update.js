'use strict'

const geoip = require('geoip-lite')
const schedule = require('node-schedule')
const geoipConfig = require(`${__base}/config`).geoip
const auditor = require(`${__base}/server/logger`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

module.exports = function (app) {
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
    logger.logDebug(PROCESS_TYPE.GEO_IP, 'Forking process to update Geo IP database.')
    auditor.auditLogBackend(PROCESS_TYPE.GEO_IP, 'Updating Geo IP database')
    fork('./node_modules/geoip-lite/scripts/updatedb.js', [], {
      detached: false,
      cwd: __base
    })
  })
}
