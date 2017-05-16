const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const jwtService = require(`${__base}/server/services/token/jwt-service`)
const validateTokenService = require(`${__base}/server/services/token/validate-token-service`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

let testData = require(`${__base}/test/server/testFiles/sample-test-data.js`).dataWithoutOptionalFields

chai.use(chaiAsPromised)
const expect = chai.expect

describe('validate token service test', () => {
  it('should build decoded payload with valid session token', () => {
    testData.sessionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token)
    })
    .then((result) => {
      return expect(result).to.have.property('sessionId', 'GBHU1020304')
    })
  })

  it('should build decoded payload with valid submission token', () => {
    testData.submissionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token)
    })
    .then((result) => {
      return expect(result).to.have.property('submissionId', 'GBHU1020304')
    })
  })

  it('should not build decoded payload with invalid session ID', () => {
    testData.sessionId = '1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should not build decoded payload with invalid submission ID', () => {
    testData.submissionId = '1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should not build decoded payload with invalid url', () => {
    testData.sessionId = 'GBHU1020304'
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'INVALID_URL', token))
              .to.eventually.be.rejected
    })
  })

  it('should not build decoded payload with invalid token', () => {
    return expect(validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', 'INVALIDTOKEN'))
              .to.eventually.be.rejected
  })

  it('should not build decoded payload with token without sessionId for session token', () => {
    testData.sessionId = null
    return jwtService.sign(testData, TOKEN_TYPE.SESSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should not build decoded payload with token without submissionId for submission token', () => {
    testData.submissionId = null
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should not build decoded payload with token with invalid token type', () => {
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken('INVALID_TOKEN_TYPE', 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should not build decoded submission payload when there is no submission id', () => {
    return jwtService.sign(testData, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })

  it('should throw error when no no decoded payload is in the JWT', () => {
    return jwtService.sign(null, TOKEN_TYPE.SUBMISSION)
    .then((token) => {
      return expect(validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vcap.me:3000', token))
              .to.eventually.be.rejectedWith(Error)
    })
  })
})
