const expect = require('chai').expect
const IconBaseError = require(`${__base}/server/models/errors/iconBaseError`)

describe('Icon base error test', () => {
  let error = new IconBaseError()

  it('should create a default error object', () => {
    expect(error.statusCode).to.equal(500)
    expect(error.logLevel).to.equal('error')
    expect(error.decoded).to.exist
    expect(error.logged).to.equal(false)
    expect(error.processType).to.equal('')
    expect(error.error).to.exist
    expect(error.stackTrace).to.exist
    expect(error.message).to.exist
  })

  it('should update the errors values when requested', () => {
    error.statusCode = 501
    expect(error.statusCode).to.equal(501)
    error.logLevel = 'warn'
    expect(error.logLevel).to.equal('warn')
    error.logged = true
    expect(error.logged).to.equal(true)
    error.processType = 'test_process'
    expect(error.processType).to.equal('test_process')
    error.decoded = 'TEST_SET_DECODED'
    expect(error.decoded).to.equal('TEST_SET_DECODED')
  })
})
