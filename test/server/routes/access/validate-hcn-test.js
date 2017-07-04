const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const validateHcn = require(`${__base}/server/routes/access/validate-hcn.js`)

const testOiid = 'XM2XBFXMB2'
const testHcn = 'asdq43sdf2342'
const testSessionToken = 'iu2n6jhh8tyw1'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  body: {
    oiid: testOiid,
    hcn: testHcn
  }
})
requestObject.headers['session-token'] = testSessionToken

describe('reset test', () => {
  validateHcn(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should return correct hcn', () => {
    expect(dhirRouter.request.hcn)
    .to.equal(testHcn)
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
