'use strict'

var cfenv = require('cfenv')

var appEnv = cfenv.getAppEnv()

module.exports = (serviceName) => {
  var serviceDetails = appEnv.getService(serviceName)
  var uri
  if (serviceDetails) {
    uri = serviceDetails['credentials']['uri']
  }
  return uri
}
