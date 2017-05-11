'use strict'

const cfenv = require('cfenv')

const appEnv = cfenv.getAppEnv()

module.exports = (serviceName) => {
  const serviceDetails = appEnv.getService(serviceName)
  let uri
  if (serviceDetails) {
    uri = serviceDetails['credentials']['uri']
  }
  return uri
}
