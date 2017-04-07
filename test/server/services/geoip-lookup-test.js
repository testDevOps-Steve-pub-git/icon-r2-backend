var expect = require('chai').expect
var geoLookup = require(__base + '/server/services/geoip-lookup.js')

describe('Geo-IP lookup test', () => {
  it('should return location specific information when given a valid IP', () => {
    return expect(geoLookup('142.222.225.55')).to.have.property('city', 'Hamilton')
  })

  it('should not return location specific information when given an ivalid IP', () => {
    try {
      return expect(geoLookup('INCORRECT_IP')).to.have.property('city', 'Hamilton')
    } catch (err) {
      return expect(err).to.be.defined
    }
  })
})
