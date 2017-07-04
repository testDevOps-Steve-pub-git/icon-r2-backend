const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const validator = require(`${__base}/server/services/attachment/validator`)
const config = require(`${__base}/config`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Validator test', () => {
  const testFile = require(`${__base}/test/server/testFiles/sample-test-data.js`)

  it('should validate allowed file sizes', () => {
    const result = validator.validSize(testFile, config)
    return expect(result).to.be.true
  })

  it('should validate allowed file types', () => {
    const result = validator.validType(testFile, config)
    return expect(result).to.be.true
  })

  it('should return true when validator is disabled', () => {
    delete config.limit
    const result = validator.validLimit(testFile, 'TEST_TX_ID', config)
    return expect(result).to.eventually.be.true
  })
})
