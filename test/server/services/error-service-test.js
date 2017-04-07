var expect = require('chai').expect
var errorService = require(__base + '/server/services/error-service.js')
var processTypes = require(`${__base}/server/models/process-type`)

describe('error service', () => {
  let options = {
    statusCode: 911,
    decoded: 'decoded_token',
    processType: processTypes.ICON
  }

  it('should create icon warning', () => {
    let result = errorService.IconWarning('This is a test warning.')
    return expect(result)
    .to.have.property('message', 'This is a test warning.')
  })

  it('should create icon error', () => {
    let result = errorService.IconError('This is a test error.')
    return expect(result)
    .to.have.property('message', 'This is a test error.')
  })

  it('should create icon info', () => {
    let result = errorService.IconInfo('This is a test info message.')
    return expect(result)
    .to.have.property('message', 'This is a test info message.')
  })

  it('should create custom error', () => {
    let result = errorService.IconCustomError('This is a test custom error.', options)
    return expect(result)
    .to.have.property('statusCode', 911)
  })

  it('should create custom warning', () => {
    let result = errorService.IconCustomWarning('This is a test custom warning.', options)
    return expect(result)
    .to.have.property('statusCode', 911)
  })

  it('should create custom info message', () => {
    let result = errorService.IconCustomInfo('This is a test custom info message.', options)
    return expect(result)
    .to.have.property('statusCode', 911)
  })
})
