var expect = require('chai').expect
var jwtService = require(__base + '/server/services/token/jwt-service')
var validateTokenService = require(__base + '/server/services/token/validate-token-service')
var testData = require(__base + '/test/server/testFiles/sample-test-data.js').dataWithoutOptionalFields
const TOKEN_TYPE = require(__base + '/server/models/token-type')

describe('validate token service test', () => {
  it('should build decoded payload with valid session token', () => {
    testData.sessionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token)
      .then((result) => {
        return expect(result).to.have.property('sessionId', 'GBHU1020304')
      })
    })
  })

  it('should build decoded payload with valid submission token', () => {
    testData.submissionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token)
      .then((result) => {
        return expect(result).to.have.property('submissionId', 'GBHU1020304')
      })
    })
  })

  it('should not build decoded payload with invalid session ID', () => {
    testData.sessionId = '1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })
  })

  it('should not build decoded payload with invalid submission ID', () => {
    testData.submissionId = '1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })
  })

  it('should not build decoded payload with invalid url', () => {
    testData.sessionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'INVALID_URL', token)
      .catch((err) => {
        return expect(err).to.have.property('_processType', 'url;parse')
      })
    })
  })

  it('should not build decoded payload with invalid token', () => {
    return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', 'INVALIDTOKEN')
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'authenticate')
    })
  })

  it('should not build decoded payload with token without sessionId for session token', () => {
    testData.sessionId = null
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token)
      .catch((err) => {
        return expect(err).be.defined
      })
    })
  })

  it('should not build decoded payload with token without submissionId for submission token', () => {
    testData.submissionId = null
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token)
      .catch((err) => {
        return expect(err).be.defined
      })
    })
  })
})
