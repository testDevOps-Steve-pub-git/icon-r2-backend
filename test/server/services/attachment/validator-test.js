var expect = require('chai').expect
var validator = require(`${__base}/server/services/attachment/validator`)
var config = require(`${__base}/config`)

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
})
