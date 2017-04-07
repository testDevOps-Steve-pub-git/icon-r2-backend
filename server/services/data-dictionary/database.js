'use strict'

const pg = require('pg')
const config = require(`${__base}/config.js`)
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

module.exports = {
  connect: connect,
  disconnect: disconnect,
  lock: lock,
  unlock: unlock
}

function connect () {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Connecting to database')
  return new Promise((resolve, reject) => {
    let client = new pg.Client(config.postgres.writer)
    client.connect((err, client) => {
      if (err) {
        err.message = `Database connect: ${err.message}`
        reject(err)
      } else {
        logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Connected to database')
        resolve(client)
      }
    })
  })
}

function lockSql () {
  const days = config.dataDictionary.schedule.frequencyInMonths * 30
  return `begin; select * from process_lock where current_date - interval '${days} days' >= updated_at and process_name='data-dictionary' for update nowait;`
}

function lock (client) {
  return new Promise((resolve, reject) => {
    if (client) {
      client.query(lockSql(), (err, result) => {
        if (err) {
          logger.logDebug(PROCESS_TYPE.DATA_DICT, `Failed to get a lock err. This is expected for multiple servers: ${err.message}`)
          reject(new Error('Failed to get a lock'))
        } else if (!result.rows || result.rows.length === 0) {
          logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Already update for this period. This is expected for multiple servers.')
          reject(new Error('Already updated'))
        } else {
          logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Process locked. Updating.')
          resolve(client)
        }
      })
    } else {
      reject(new Error('Process lock: no client found'))
    }
  })
}

function unlockSql () {
  return `update process_lock set updated_at = current_date where process_name='data-dictionary'; commit;`
}

function unlock (client) {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Unlocking process.')
  return new Promise((resolve, reject) => {
    if (client) {
      client.query(unlockSql(), (err, result) => {
        if (err) {
          err.message = `Process unlock: ${err.message}`
          reject(err)
        } else {
          logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Unlocked.')
          resolve(client)
        }
      })
    } else {
      reject(new Error('Process unlock: no client found'))
    }
  })
}

function disconnect (client) {
  logger.logDebug(PROCESS_TYPE.DATA_DICT, 'Disconnecting from database')
  return new Promise((resolve, reject) => {
    if (client) {
      client.end((err) => {
        if (err) {
          err.message = `Database disconnect: ${err.message}`
          reject(err)
        } else {
          resolve(client)
        }
      })
    } else {
      reject(new Error('Database disconnect: no client found'))
    }
  })
}

