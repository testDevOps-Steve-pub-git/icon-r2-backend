'use strict'
const geoip = require('geoip-lite')

module.exports = (ipAddress) => {
  const geo = geoip.lookup(ipAddress)
  return geo
}
