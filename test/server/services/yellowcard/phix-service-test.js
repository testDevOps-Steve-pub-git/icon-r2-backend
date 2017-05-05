const expect = require('chai').expect
const proxyquire = require('proxyquire')
const logger = `${__base}/server/logger`

const phixService = proxyquire(`${__base}/server/services/yellowcard/phix-service.js`, {
  [`${logger}`]: {
    debug: (logLevel, logObject) => {
      return logObject
    },
    '@global': true
  }
})

describe('PHIX service test', () => {
  const oiid = '0000-0000-0000'
  const pin = 123123
  const token = 'TEST_TOKEN'
  const metaObject = {
    testField1: 'TEST',
    testField2: 'TEST'
  }

  it('should generate request options', () => {
    const result = phixService.generateRequestOptions(oiid, pin, token)
    return expect(result).to.have.property('headers')
  })

  it('should generate request options when given metaObject', () => {
    const result = phixService.generateRequestOptions(oiid, pin, token, metaObject)
    return expect(result).to.have.property('headers')
  })

  it('should log gating questions', () => {
    const result = phixService.logGatingQuestion('TEST_RELATIONSHIP', metaObject)
    expect(result).to.have.property('processType', 'retrieval;ICON')
    expect(result).to.have.property('interactionType', 'retrieval')
    expect(result).to.have.property('reltoClient', 'TEST_RELATIONSHIP')
  })
})
