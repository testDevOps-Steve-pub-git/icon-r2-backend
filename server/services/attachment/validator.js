'use strict'

function validSize (file, config) {
  if (config.size) {
    return file.buffer.length < config.size
  } else {
    return true
  }
}

function validType (file, config) {
  if (config.types) {
    return config.types.includes(file.mimetype)
  } else {
    return true
  }
}

module.exports = {
  validSize: validSize,
  validType: validType
}
