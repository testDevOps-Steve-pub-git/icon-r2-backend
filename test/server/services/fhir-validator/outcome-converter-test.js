const expect = require('chai').expect
const outcomeConverter = require(`${__base}/server/services/fhir-validator/outcome-converter`)

describe('FHIR Validation outcome converter', () => {
  const id = 'TEST_ID'

  const errors = [
    {
      keyword: 'TEST_ERROR_CODE_1',
      path: 'TEST_ERROR_PATH_1',
      message: 'TEST_ERROR_MESSAGE_1'
    },
    {
      keyword: 'TEST_ERROR_CODE_2',
      path: 'TEST_ERROR_PATH_2',
      message: 'TEST_ERROR_MESSAGE_2'
    },
    {
      keyword: 'TEST_ERROR_CODE_3',
      path: 'TEST_ERROR_PATH_3',
      message: 'TEST_ERROR_MESSAGE_3'
    },
    { }
  ]

  const noErrors = []

  it('should generate outcome html created from an array of errors', () => {
    const outcome = outcomeConverter.convertErrorsToOutcome(id, errors)
    return expect(JSON.parse(outcome)).to.have.property('id', 'TEST_ID')
  })

  it('should return null when error field supplied is empty', () => {
    return expect(outcomeConverter.convertErrorsToOutcome(id)).to.be.null
  })

  it('should use default values if error has no keyword/path/message', () => {
    const outcome = outcomeConverter.convertErrorsToOutcome(id, errors)
    expect(JSON.parse(outcome).issues[3]).to.have.property('code', '')
    expect(JSON.parse(outcome).issues[3]).to.have.property('location', '')
    return expect(JSON.parse(outcome).issues[3]).to.have.property('detailText', '')
  })

  it('should use default value if no there is id', () => {
    const outcome = outcomeConverter.convertErrorsToOutcome(null, noErrors)
    return expect(JSON.parse(outcome)).to.have.property('id', '')
  })
})
