'use strict'
var geoip = require('geoip-lite')

module.exports = (ipAddress) => {
  var geo = geoip.lookup(ipAddress)
  return geo
}
