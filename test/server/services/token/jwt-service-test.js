const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const jwtService = require(__base + '/server/services/token/jwt-service')
const sampleTestData = require(__base + '/test/server/testFiles/sample-test-data.js')
const expiredToken = require(__base + '/test/server/testFiles/expired-token.js')
const TOKEN_TYPE = require(__base + '/server/models/token-type')

chai.use(chaiAsPromised)
const expect = chai.expect

describe('jwt service test', () => {
  it('should generate a session token with valid input', () => {
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SESSION)
    .then((result) => {
      return expect(result).to.be.defined
    })
  })

  it('should generate a submission token with valid input', () => {
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION)
    .then((result) => {
      return expect(result).to.be.defined
    })
  })

  it('should return decoded token when verifying a valid session token', () => {
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SESSION)
    .then(jwtService.verify)
    .then((result) => {
      return expect(result).to.have.property('aud', 'ICON-Server')
    })
  })

  it('should return decoded token when verifying a valid submission token', () => {
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION)
    .then(jwtService.verify)
    .then((result) => {
      return expect(result).to.have.property('aud', 'ICON-Server')
    })
  })

  it('should not generate token with undefined token type', () => {
    try {
      jwtService.sign(sampleTestData.dataWithoutOptionalFields, 'INVALID_TOKEN_TYPE')
    } catch (err) {
      return expect(err._statusCode).to.equal(500)
    }
  })

  it('should not return decoded token for expired jwt', () => {
    return expect(jwtService.verify(expiredToken))
          .to.eventually.be.rejected
  })

  it('should not return decoded token when verifying an invalid token', () => {
    return expect(jwtService.verify('INVALID_TOKEN'))
          .to.eventually.be.rejected
  })
})
