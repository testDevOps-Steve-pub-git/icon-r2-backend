const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const resetPin = require(`${__base}/server/routes/access/reset-pin.js`)

const testOiid = 'XM2XBFXMB2'
const testToken = 'iu2n6jhh8tyw1'
const testRole = 'self'
const testPin = '123123'
const testSessionToken = 'asdq43sdf2342'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  body: {
    oiid: testOiid,
    token: testToken,
    role: testRole
  }
})
requestObject.body['immunizations-context'] = testPin
requestObject.headers['session-token'] = testSessionToken

describe('reset-pin test', () => {
  resetPin(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should return correct sessionToken', () => {
    expect(dhirRouter.request.sessionToken)
    .to.equal(testSessionToken)
  })

  it('should return correct token', () => {
    expect(dhirRouter.request.token)
    .to.equal(testToken)
  })

  it('should return correct role', () => {
    expect(dhirRouter.request.role)
    .to.equal(testRole)
  })

  it('should return correct pin', () => {
    expect(dhirRouter.request.pin)
    .to.equal(testPin)
  })

  it('should have service property', () => {
    expect(dhirRouter).to.have.property('service')
  })

  it('should have processType property', () => {
    expect(dhirRouter).to.have.property('processType')
  })
})
