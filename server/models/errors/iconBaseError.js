'use strict'

var statusCodes = require(`${__base}/server/models/response-status-code`)

module.exports = class IconBaseError {
  constructor (error) {
    this._error = this.isError(error) ? error : new Error(error)
    this._statusCode = statusCodes.INTERNAL_SERVER_ERROR
    this._decoded = {}
    this._processType = ''
    this._logLevel = 'error'
    this._logged = false
  }

  isError (error) {
    return error instanceof Error
  }

  get message () {
    return this._error.message
  }

  get stackTrace () {
    // stringify to get the stack trace on one line to avoid proablems
    // with the logger adding multiple entries
    return JSON.stringify(this._error.stack) || ''
  }

  get error () {
    return this._error
  }

  get logLevel () {
    return this._logLevel
  }

  set logLevel (val) {
    this._logLevel = val
  }

  get statusCode () {
    return this._statusCode
  }

  set statusCode (val) {
    this._statusCode = val
  }

  get decoded () {
    return this._decoded
  }

  set decoded (val) {
    this._decoded = val
  }

  get processType () {
    return this._processType
  }

  set processType (val) {
    this._processType = val
  }

  get logged () {
    return this._logged
  }

  set logged (val) {
    this._logged = val
  }
}

