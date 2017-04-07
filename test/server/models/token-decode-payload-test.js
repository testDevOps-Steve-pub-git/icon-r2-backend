var expect = require('chai').expect
var jwtService = require(__base + '/server/services/token/jwt-service')
var sampleTestData = require(__base + '/test/server/testFiles/sample-test-data.js')
const TOKEN_TYPE = require(__base + '/server/models/token-type')
var tokenDecodePayload = require(__base + '/server/models/token-decode-payload.js')

describe('token decode payload test', () => {
  let sessionToken = Promise.resolve(jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SESSION))
  let submissionToken = Promise.resolve(jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION))
  let sessionHeaders = {
    'session-token': sessionToken,
    'x-real-ip': 'test_url'
  }
  let submissionHeaders = {
    'submission-token': submissionToken,
    'x-real-ip': 'test_url'
  }
  let decodedToken = {
    sessionId: 'GBHU100',
    phuName: 'Grey Bruce Health Unit',
    phuId: '6',
    phuAcronym: 'GBHU',
    submissionId: 'GBHU200'
  }

  it('should create session payload', () => {
    let result = tokenDecodePayload.CreateSessionPayload(decodedToken, sessionHeaders)
    expect(result).to.have.property('phuAcronym', 'GBHU')
  })

  it('should create submission payload', () => {
    let result = tokenDecodePayload.CreateSubmissionPayload(decodedToken, submissionHeaders)
    expect(result).to.have.property('phuAcronym', 'GBHU')
  })
})
