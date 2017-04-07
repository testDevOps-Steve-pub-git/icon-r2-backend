var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var tokenService = require(__base + '/server/services/token-service.js')
var jwtService = require(__base + '/server/services/token/jwt-service.js')
var sampleTestData = require(__base + '/test/server/testFiles/sample-test-data.js')
const TOKEN_TYPE = require(__base + '/server/models/token-type')

chai.use(chaiAsPromised)
var expect = chai.expect

describe('token service test', () => {
  it('should generate a session token', () => {
    return tokenService.generate.session('eohu.vcap.me:3000')
    .then((sessionToken) => {
      return expect(sessionToken).to.exist
    })
  })

  it('should generate a submission token', () => {
    return tokenService.generate.submission('ckphu.vcap.me:3000')
    .then((submissionToken) => {
      return expect(submissionToken).to.exist
    })
  })

  it('should authenticate valid session succesfully', () => {
    sampleTestData.dataWithoutOptionalFields.sessionId = 'DRHD'
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SESSION)
    .then((tokenResult) => {
      return tokenService.authenticate.session('drhd.vcap.me:3000', tokenResult)
      .then((phuInfo) => {
        return expect(phuInfo.phuAcronym).to.equal('DRHD')
      })
    })
  })

  it('should authenticate valid submission succesfully', () => {
    sampleTestData.dataWithoutOptionalFields.sessionId = 'CKPHU'
    return jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION)
    .then((tokenResult) => {
      return tokenService.authenticate.session('ckphu.vcap.me:3000', tokenResult)
      .then((phuInfo) => {
        return expect(phuInfo.phuAcronym).to.equal('CKPHU')
      })
    })
  })
})
