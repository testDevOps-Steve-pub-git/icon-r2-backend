const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire')
const logger = `${__base}/server/logger`

const loggerService = proxyquire(`${__base}/server/services/logger-service.js`, {
  [`${logger}`]: {
    error: () => {},
    warn: () => {},
    debug: () => {},
    info: () => {}
  }
})

chai.use(chaiAsPromised)
const expect = chai.expect

describe('logger service test', () => {
  const testOptions = {
    customMessage: 'test'
  }

  it('should log errors', () => {
    return expect(Promise.resolve(loggerService.logError('error_log_test', 'error_message', testOptions)))
    .to.be.fulfilled
  })

  it('should log debug message', () => {
    return expect(Promise.resolve(loggerService.logDebug('debug_log_test', 'debug_message', testOptions)))
    .to.be.fulfilled
  })

  it('should log info message', () => {
    return expect(Promise.resolve(loggerService.logInfo('info_log_test', 'info_message', testOptions)))
    .to.be.fulfilled
  })

  it('should log warnings', () => {
    return expect(Promise.resolve(loggerService.logWarning('warning_log_test', 'error_message', testOptions)))
    .to.be.fulfilled
  })

  it('should log custom messages', () => {
    return expect(Promise.resolve(loggerService.log('test_log', 'custom_log_test', 'test', testOptions)))
    .to.be.fulfilled
  })

  it('should log icon errors', () => {
    return expect(Promise.resolve(loggerService.logIconError(new Error())))
    .to.be.fulfilled
  })

  it('should log icon errors - alternate', () => {
    return expect(Promise.resolve(loggerService.logIcon(new Error())))
    .to.be.fulfilled
  })
})
