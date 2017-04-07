var expect = require('chai').expect
var phuService = require(__base + '/server/services/token/phu-service')

describe('phu service test', () => {
  it('should return correct phu object for a valid url (with http://)', () => {
    return phuService.getPhuObjectFromUrl('http://GBHU.vcap.me:3000')
    .then((result) => {
      return expect(result).to.have.property('name', 'Grey Bruce Health Unit')
    })
  })

  it('should return correct phu object for a valid url (without http://)', () => {
    return phuService.getPhuObjectFromUrl('CKPHU.vcap.me:3000')
    .then((result) => {
      return expect(result).to.have.property('name', 'Chatham-Kent Health Unit')
    })
  })

  it('should not return a phu object for an invalid url', () => {
    return phuService.getPhuObjectFromUrl('INVALID_URL')
    .then(() => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'url;parse')
    })
  })

  it('should not return a phu object with an invalid phu acronym in url', () => {
    return phuService.getPhuObjectFromUrl('psmn.vcap.me:3000')
    .then(() => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'url;parse')
    })
  })
})
