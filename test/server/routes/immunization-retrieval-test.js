const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const immunizationRetrieval = require(`${__base}/server/routes/immunization-retrieval.js`)

const testOiid = 'XM2XBFXMB2'
const testPin = '123123'
const testSessionToken = 'asdq43sdf2342'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  headers: {
    oiid: testOiid
  }
})
requestObject.headers['immunizations-context'] = testPin
requestObject.headers['session-token'] = testSessionToken

describe('immunization-retrieval test', () => {
  immunizationRetrieval(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    return expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should return correct token', () => {
    return expect(dhirRouter.request.token)
    .to.equal(testSessionToken)
  })

  it('should return correct context', () => {
    return expect(dhirRouter.request.context)
    .to.equal(testPin)
  })

  it('should have service property', () => {
    return expect(dhirRouter).to.have.property('service')
  })

  it('should have processType property', () => {
    return expect(dhirRouter).to.have.property('processType')
  })
})
