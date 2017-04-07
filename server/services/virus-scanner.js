'use strict'
var Promise = require('bluebird')
var clamav = require('clamav.js')
var stream = require('stream')
var errorHandler = require(`${__base}/server/services/error-service`)

/**
 * @module Virus Scanner. Middleware to virus scan uploaded file
 */

function getScanner (config) {
  return clamav.createScanner(config.port, config.endPoint)
}

function getBufferStream (buffer) {
  var bufferStream = new stream.PassThrough()
  bufferStream.end(buffer.toString())
  return bufferStream
}

// function scanBuffer (buffer, config) {
module.exports = (buffer, config) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      reject(errorHandler.IconError('Empty Buffer'))
    }

    getScanner(config).scan(getBufferStream(buffer), (err, object, malicious) => {
      if (err) {
        reject(new errorHandler.IconError(err))
      } else if (malicious) {
        reject(errorHandler.IconWarning(`virus found in file: ${malicious}`))
      } else {
        resolve()
      }
    })
  })
}
