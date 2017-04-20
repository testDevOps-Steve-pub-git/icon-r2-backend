var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var validator = require(`${__base}/server/services/attachment/validator`)
var config = require(`${__base}/config`)

chai.use(chaiAsPromised)
var expect = chai.expect

describe('Validator test', () => {
  var testFile = require(`${__base}/test/server/testFiles/sample-test-data.js`)

  it('should validate allowed file sizes', () => {
    var result = validator.validSize(testFile, config)
    return expect(result).to.be.true
  })

  it('should validate allowed file types', () => {
    var result = validator.validType(testFile, config)
    return expect(result).to.be.true
  })

  it('should return true when validator is disabled', () => {
    delete config.limit
    var result = validator.validLimit(testFile, 'TEST_TX_ID', config)
    return expect(result).to.eventually.be.true
  })
})
