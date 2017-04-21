const expect = require('chai').expect
const authenticateService = require(`${__base}/server/services/yellowcard/authenticate-service`)

describe('Yellowcard authenticate service', () => {
  it('should create session', () => {
    var sessionId, clientip, token, phuName, phuAcronym, oiid, pin, relationship, language

    sessionId = 'TEST_SESSION_ID'
    clientip = 'TEST_CLIENT_IP'
    token = 'TEST_TOKEN'
    phuName = 'TEST_PHU_NAME'
    phuAcronym = 'TEST_PHU_ACRONYM'
    oiid = 'TEST_OIID'
    pin = 'TEST_PIN'
    relationship = 'TEST_RELATIONSHIP'
    language = 'TEST_LANGUAGE'

    var result = authenticateService.create.session(sessionId, clientip, token, phuName, phuAcronym, oiid, pin, relationship, language)
    expect(result).to.have.property('token', 'TEST_TOKEN')
    expect(result).to.have.property('metaData')
    expect(result).to.have.property('client')

    if (result.client) {
      expect(result.client).to.have.property('oiid', 'TEST_OIID')
      expect(result.client).to.have.property('pin', 'TEST_PIN')
      expect(result.client).to.have.property('relationship', 'TEST_RELATIONSHIP')
      expect(result.client).to.have.property('language', 'TEST_LANGUAGE')
    } else {
      expect.fail()
    }

    if (result.metaData) {
      expect(result.metaData).to.have.property('sessionId', 'TEST_SESSION_ID')
      expect(result.metaData).to.have.property('clientip', 'TEST_CLIENT_IP')
      expect(result.metaData).to.have.property('phuName', 'TEST_PHU_NAME')
      expect(result.metaData).to.have.property('phuAcronym', 'TEST_PHU_ACRONYM')
    } else {
      expect.fail()
    }
  })

  it('should create error message with no conditions', () => {
    var errorConditions = {
      hasOiid: false,
      hasPin: false,
      hasRelationship: false
    }

    var expectedResult = `WARNING: Certain Parameters were not passed: {OIID, PIN, RELATIONSHIP}`

    var result = authenticateService.create.errorMessage(errorConditions)
    expect(result).to.be.equal(expectedResult)
  })

  it('should create error message with some missing conditions', () => {
    var errorConditions = {
      hasOiid: true,
      hasPin: false,
      hasRelationship: true
    }

    var expectedResult = `WARNING: Certain Parameters were not passed: {PIN}`

    var result = authenticateService.create.errorMessage(errorConditions)
    expect(result).to.be.equal(expectedResult)
  })

  it('should inform of lack of conditions parameters', () => {
    var errorConditions = {}

    var expectedResult = `WARNING: Certain Parameters were not passed: {set of conditions were not passed in. Could not validate the error (regarding oiid, pin, and relationship)}`

    var result = authenticateService.create.errorMessage(errorConditions)
    expect(result).to.be.equal(expectedResult)
  })
})
