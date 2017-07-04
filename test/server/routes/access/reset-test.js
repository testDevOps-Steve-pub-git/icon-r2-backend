const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const reset = require(`${__base}/server/routes/access/reset.js`)

const testOiid = 'XM2XBFXMB2'
const testEmail = 'test@test.com'
const testLang = 'en'
const testCallbackUrl = 'www.example.com'
const testSessionToken = 'iu2n6jhh8tyw1'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  body: {
    oiid: testOiid,
    email: testEmail,
    lang: testLang,
    callbackUrl: testCallbackUrl
  }
})
requestObject.headers['session-token'] = testSessionToken

describe('reset test', () => {
  reset(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct oiid', () => {
    expect(dhirRouter.request.oiid)
    .to.equal(testOiid)
  })

  it('should return correct email', () => {
    expect(dhirRouter.request.email)
    .to.equal(testEmail)
  })

  it('should return correct lang', () => {
    expect(dhirRouter.request.lang)
    .to.equal(testLang)
  })

  it('should return correct callbackUrl', () => {
    expect(dhirRouter.request.callbackUrl)
    .to.equal(testCallbackUrl)
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
