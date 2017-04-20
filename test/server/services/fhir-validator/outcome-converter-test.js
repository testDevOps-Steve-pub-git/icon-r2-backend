var expect = require('chai').expect
var outcomeConverter = require(`${__base}/server/services/fhir-validator/outcome-converter`)

describe('FHIR Validation outcome converter', () => {
  var id = 'TEST_ID'

  var errors = [
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
    }
  ]

  it('should generate outcome html created from an array of errors', () => {
    var outcome = outcomeConverter.convertErrorsToOutcome(id, errors)
    return expect(JSON.parse(outcome)).to.have.property('id', 'TEST_ID')
  })

  it('should return null when error field supplied is empty', () => {
    return expect(outcomeConverter.convertErrorsToOutcome(id)).to.be.null
  })
})
