const expect = require('chai').expect
const jwtService = require(`${__base}/server/services/token/jwt-service`)
const sampleTestData = require(`${__base}/test/server/testFiles/sample-test-data.js`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)
const tokenDecodePayload = require(`${__base}/server/models/token-decode-payload.js`)

describe('token decode payload test', () => {
  const sessionToken = Promise.resolve(jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SESSION))
  const submissionToken = Promise.resolve(jwtService.sign(sampleTestData.dataWithoutOptionalFields, TOKEN_TYPE.SUBMISSION))
  const sessionHeaders = {
    'session-token': sessionToken,
    'x-real-ip': 'test_url'
  }
  const submissionHeaders = {
    'submission-token': submissionToken,
    'x-real-ip': 'test_url'
  }
  const decodedToken = {
    sessionId: 'GBHU100',
    phuName: 'Grey Bruce Health Unit',
    phuId: '6',
    phuAcronym: 'GBHU',
    submissionId: 'GBHU200'
  }

  it('should create session payload', () => {
    const result = tokenDecodePayload.CreateSessionPayload(decodedToken, sessionHeaders)
    expect(result).to.have.property('phuAcronym', 'GBHU')
    expect(result).to.have.property('phuName', 'Grey Bruce Health Unit')
    expect(result).to.have.property('phuId', '6')
  })

  it('should create submission payload', () => {
    const result = tokenDecodePayload.CreateSubmissionPayload(decodedToken, submissionHeaders)
    expect(result).to.have.property('phuAcronym', 'GBHU')
  })
})
