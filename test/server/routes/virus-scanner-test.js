const chai = require('chai')
const expect = chai.expect
const config = require(`${__base}/config`)
const httpMocks = require('node-mocks-http')
const logger = `${__base}/server/logger`
const proxyquire = require('proxyquire')

const virusScanner = proxyquire(`${__base}/server/routes/virus-scanner.js`, {
  [`${logger}`]: {
    debug: () => { }
  }
})

let res = { }
let reqWithNoFiles = httpMocks.createRequest({
  files: [{ }]
})

let reqWithFiles = httpMocks.createRequest({
  files: [{
    buffer: true
  }]
})

describe('virus-scanner test', () => {
  it('should reject when no file is provided', () => {
    virusScanner(reqWithNoFiles, res, function (err) {
      return expect(err).to.be.an('error')
    })
  })

  it('should return the next function when clamav is disabled', () => {
    config.clamav.enabled = false
    const nextReturn = virusScanner(reqWithFiles, res, () => {
      return 'testString'
    })
    expect(nextReturn).to.equal('testString')
  })
})
