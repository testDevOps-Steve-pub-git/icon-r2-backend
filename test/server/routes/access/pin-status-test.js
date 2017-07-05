const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const pinStatus = require(`${__base}/server/routes/access/pin-status.js`)

const testOiid = 'XM2XBFXMB2'
const testSessionToken = 'asdq43sdf2342'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  headers: {
    oiid: testOiid
  }
})
requestObject.headers['session-token'] = testSessionToken

describe('pin-status test', () => {
  pinStatus(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should return correct sessionToken', () => {
    expect(dhirRouter.request.sessionToken)
    .to.equal(testSessionToken)
  })

  it('should have service property', () => {
    expect(dhirRouter).to.have.property('service')
  })

  it('should have processType property', () => {
    expect(dhirRouter).to.have.property('processType')
  })
})
