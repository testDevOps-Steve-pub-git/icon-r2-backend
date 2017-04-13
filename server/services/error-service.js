'use strict'

var IconBaseError = require(`${__base}/server/models/errors/iconBaseError`)

/**
  * @function transfers custom error option fields to input error
  * @param {Object || String} error for custom fields to be added to
  * @param {Object} options with custom fields to be added to error
  * @return {Object} error with custom fields loaded
  */
function loadCustomFields (obj, options) {
  for (let key in options) {
    if (options.hasOwnProperty(key)) {
      obj[key] = options[key]
    }
  }
  return obj
}

/**
  * @function create ICON warning with custom message
  * @message {String} custom message to be added to warning
  * @return {Object} ICON warning with custom message
  */
function createIconWarning (message) {
  let warn = new IconBaseError(message)
  warn.logLevel = 'warn'
  return warn
}

/**
  * @function create ICON error with custom message
  * @param {String} message: custom message to be added to error
  * @return {Object} ICON error with custom message
  */
function createIconError (message) {
  let err = new IconBaseError(message)
  err.logLevel = 'error'
  return err
}

/**
  * @function create ICON info with custom message
  * @param {String} message: custom message to be added to info
  * @return {Object} ICON info with custom message
  */
function createIconInfo (message) {
  let info = new IconBaseError(message)
  info.logLevel = 'info'
  return info
}

/**
  * @function create ICON custom error with variable inputs
  * @param {String} message: custom message to be added to error
  * @param {Object} options: JSON object containing custom fields to add to error
  * @return {Object} ICON error with custom message and fields
  */
function createCustomError (message, options) {
  let err = new IconBaseError(message)
  err.logLevel = 'error'
  err = loadCustomFields(err, options)
  return err
}

/**
  * @function create ICON custom warning with variable inputs
  * @param {String} message: custom message to be added to warning
  * @param {Object} options: JSON object containing custom fields to add to warning
  * @return {Object} ICON warning with custom message and fields
  */
function createCustomWarning (message, options) {
  let warn = new IconBaseError(message)
  warn.logLevel = 'warn'
  warn = loadCustomFields(warn, options)
  return warn
}

/**
  * @function create ICON custom info with variable inputs
  * @param {String} message: custom message to be added to info
  * @param {Object} options: JSON object containing custom fields to add to info
  * @return {Object} ICON info with custom message and fields
  */
function createCustomInfo (message, options) {
  let info = new IconBaseError(message)
  info.logLevel = 'info'
  info = loadCustomFields(info, options)
  return info
}

/**
  *@module error-service
  */
module.exports = {
  IconError: createIconError,
  IconWarning: createIconWarning,
  IconInfo: createIconInfo,
  IconCustomError: createCustomError,
  IconCustomWarning: createCustomWarning,
  IconCustomInfo: createCustomInfo
}
