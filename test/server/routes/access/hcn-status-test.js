const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const hcnStatus = require(`${__base}/server/routes/access/hcn-status.js`)

const testOiid = 'XM2XBFXMB2'
const testSessionToken = 'iu2n6jhh8tyw1'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  headers: {
    oiid: testOiid
  }
})
requestObject.headers['session-token'] = testSessionToken

describe('hcn status', () => {
  hcnStatus(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should have service property', () => {
    expect(dhirRouter).to.have.property('service')
  })

  it('should have processType property', () => {
    expect(dhirRouter).to.have.property('processType')
  })
})
