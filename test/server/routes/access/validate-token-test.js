const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const validateToken = require(`${__base}/server/routes/access/validate-token.js`)

const testToken = 'asdq43sdf2342'
const testSessionToken = 'iu2n6jhh8tyw1'

let responseObject = {
  locals: { }
}

let requestObject = httpMocks.createRequest({
  body: {
    token: testToken
  }
})
requestObject.headers['session-token'] = testSessionToken

describe('validate-token test', () => {
  validateToken(requestObject, responseObject, () => {})
  const dhirRouter = responseObject.locals.dhirRouter

  it('should return correct token', () => {
    expect(dhirRouter.request.token)
    .to.equal(testToken)
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
