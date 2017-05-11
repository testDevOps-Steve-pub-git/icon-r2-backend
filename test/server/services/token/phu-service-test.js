const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const phuService = require(`${__base}/server/services/token/phu-service`)

chai.use(chaiAsPromised)
const expect = chai.expect

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
    return expect(phuService.getPhuObjectFromUrl('INVALID_URL'))
            .to.eventually.be.rejected
  })

  it('should not return a phu object with an invalid phu acronym in url', () => {
    return expect(phuService.getPhuObjectFromUrl('psmn.vcap.me:3000'))
            .to.eventually.be.rejected
  })
})
