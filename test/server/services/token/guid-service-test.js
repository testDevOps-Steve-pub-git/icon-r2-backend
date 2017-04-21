var expect = require('chai').expect
var guidService = require(`${__base}/server/services/token/guid-service`)

describe('guid service test', () => {
  it('should return a GUID (64)', () => {
    var guid64 = guidService.base64Guid()
    return expect(guid64).to.be.defined
  })

  it('should return a GUID (31)', () => {
    var guid31 = guidService.base31Guid()
    return expect(guid31).to.be.defined
  })

  it('should return a GUID (31) that only contains capital letters and numbers (not including 0, O, 1, I, L)', () => {
    var guid31 = guidService.base31Guid()
    var isValid = true
    var base31Chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

    for (var i = 0; i < guid31.length; i++) {
      if (!base31Chars.includes(guid31[i])) {
        isValid = false
      }
    }
    return expect(isValid).to.equal(true)
  })

  it('should return a different GUID each call (64)', () => {
    var firstGuid64 = guidService.base64Guid()
    var secondGuid64 = guidService.base64Guid()
    return expect(firstGuid64).to.not.equal(secondGuid64)
  })

  it('should return a different GUID each call (31)', () => {
    var firstGuid31 = guidService.base31Guid()
    var secondGuid31 = guidService.base31Guid()
    return expect(firstGuid31).to.not.equal(secondGuid31)
  })
})
