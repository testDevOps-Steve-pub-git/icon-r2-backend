const expect = require('chai').expect
const httpMocks = require('node-mocks-http')
const logger = `${__base}/server/logger`
const proxyquire = require('proxyquire')

const validateFhir = proxyquire(`${__base}/server/routes/validate-fhir`, {
  [`${logger}`]: {
    debug: () => {}
  }
})

let responseObject = { }

let requestObject = httpMocks.createRequest({ })

describe('Validate-fhir', () => {
  it('should error when response or request is invalid', () => {
    function callbackFunction (err) {
      expect(err).to.be.an('error')
    }
    validateFhir(requestObject, responseObject, callbackFunction)
  })
})
