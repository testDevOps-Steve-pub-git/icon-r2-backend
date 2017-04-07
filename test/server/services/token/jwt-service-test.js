var expect = require('chai').expect
var jwtService = require(__base + '/server/services/token/jwt-service')
var sampleTestData = require(__base + '/test/server/testFiles/sample-test-data.js')
var expiredToken = require(__base + '/test/server/testFiles/expired-token.js')
const TOKEN_TYPE = require(__base + '/server/models/token-type')

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
    .then((token) => {
      return jwtService.verify(token)
      .then((result) => {
        return expect(result).to.have.property('aud', 'ICON-Server')
      })
    })
  })

  it('should return decoded token when verifying a valid submission token', () => {
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return jwtService.verify(token)
      .then((result) => {
        return expect(result).to.have.property('aud', 'ICON-Server')
      })
    })
  })

  it('should not generate token with undefined token type', () => {
    try {
      return jwtService.sign(sampleTestData.dataWithoutOptionalFields, 'INVALID_TOKEN_TYPE')
      .then((result) => {
        return expect.fail()
      })
    } catch (err) {
      return expect(err).to.have.property('_processType', 'authenticate')
    }
  })

  it('should not return decoded token for expired jwt', () => {
    return jwtService.verify(expiredToken)
    .then(() => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'authenticate')
    })
  })

  it('should not return decoded token when verifying an invalid token', () => {
    return jwtService.verify('INVALID_TOKEN')
    .then(() => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'authenticate')
    })
  })
})
