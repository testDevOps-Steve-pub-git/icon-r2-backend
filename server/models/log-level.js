'use strict'

/**
 * This is a list of valid log levels {info, error, warn, audit, debug}
 * @constant LOG_LEVEL
 * @type   {list{string}}
 * @return {list{string}}   - contains the log level being logged by the server
 * ==================================================================================================
 */
const LOG_LEVEL = {
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warn',
  WARN: 'warn',
  AUDIT: 'audit',
  DEBUG: 'debug'
}

module.exports = LOG_LEVEL
