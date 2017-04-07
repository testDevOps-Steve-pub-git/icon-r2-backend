var expect = require('chai').expect
var phixService = require(`${__base}/server/services/yellowcard/phix-service.js`)

describe('PHIX service test', () => {
  var oiid = '0000-0000-0000'
  var pin = 123123
  var token = 'TEST_TOKEN'
  var metaObject = {
    testField1: 'TEST',
    testField2: 'TEST'
  }

  it('should generate request options', () => {
    var result = phixService.generateRequestOptions(oiid, pin, token)
    return expect(result).to.have.property('headers')
  })

  it('should generate request options when given metaObject', () => {
    var result = phixService.generateRequestOptions(oiid, pin, token, metaObject)
    return expect(result).to.have.property('headers')
  })
})
