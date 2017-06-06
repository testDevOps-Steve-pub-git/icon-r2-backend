'use strict'

const Promise = require('bluebird')
const requestPromise = require('request-promise')
const config = require(`${__base}/config`).clamav

function validate (buffer) {
  if (!buffer) {
    throw new Error('No file found')
  }

  return buffer
}

function scan (buffer) {
  return requestPromise({
    url: config.endPoint,
    method: 'POST',
    formData: {
      data: buffer
    }
  })
}

module.exports = (buffer) => {
  return Promise.resolve(buffer)
  .then(validate)
  .then(scan)
}
