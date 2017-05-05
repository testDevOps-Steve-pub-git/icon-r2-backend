const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire').noPreserveCache()

chai.use(chaiAsPromised)
const expect = chai.expect

const buffer = 'test_file'
const config = {}
const virusScanner = require(`${__base}/server/services/virus-scanner.js`)

function proxyClamav (callback) {
  return proxyquire(`${__base}/server/services/virus-scanner.js`, {
    'clamav.js': {
      createScanner: (port, endPoint) => {
        return {scan: callback}
      }
    }
  })
}

function failed () {
  expect(true).to.be.false
}
function passed () {
  expect(true).to.be.true
}

describe('virus scanner', () => {
  describe('when called with an empty buffer', () => {
    it('should reject with an error', () => {
      return virusScanner(null, config)
      .then(failed)
      .catch((err) => {
        expect(err.message).to.equal('Empty Buffer')
        expect(err.logLevel).to.equal('error')
      })
    })
  })

  describe('when scanner throws an error', () => {
    it('should reject with an error', () => {
      const virusScanner = proxyClamav((buffer, cb) => {
        cb(new Error('failed'), buffer, null)
      })
      return virusScanner(buffer, config)
      .then(failed)
      .catch((err) => {
        expect(err.message).to.equal('failed')
        expect(err.logLevel).to.equal('error')
      })
    })
  })

  describe('when scanner finds a virus', () => {
    it('should reject with a warning', () => {
      const virusScanner = proxyClamav((buffer, cb) => {
        cb(null, buffer, 'VIRUS!')
      })
      return virusScanner(buffer, config)
      .then(failed)
      .catch((warn) => {
        expect(warn.message).to.contain('VIRUS!')
        expect(warn.logLevel).to.equal('warn')
      })
    })
  })

  describe('when scan is ok', () => {
    it('should resolve', () => {
      const virusScanner = proxyClamav((buffer, cb) => {
        cb(null, buffer, null)
      })
      return virusScanner(buffer, {})
      .then(passed)
      .catch(failed)
    })
  })
})
