const proxyquire = require('proxyquire')
const expect = require('chai').expect
const loggerPath = `${__base}/server/logger`
const app = require(`${__base}/server/server`)
const fhirValidatorPath = `${__base}/server/services/fhir-validator.js`
const getTokenService = require(`${__base}/server/services/token/get-token-service.js`)
const validateTokenService = require(`${__base}/server/services/token/validate-token-service.js`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)
const validFhirMessage = require(`${__base}/test/server/testFiles/immunization-submission/ImmunizationSubmission.json`)

const request = require('supertest-as-promised')(app)
const fhirValidator = proxyquire(fhirValidatorPath, {
  [`${loggerPath}`]: {
    info: () => {},
    '@global': true
  }
})

function createVhostTester (app, vhost) {
  const real = request
  const proxy = {}

  Object.keys(real).forEach(methodName => {
    proxy[methodName] = function () {
      return real[methodName]
        .apply(real, arguments)
        .set('host', vhost)
    }
  })
  return proxy
}

const appTest = createVhostTester(app, 'gbhu.vpac.me:3000')

function getDecoded (appTestDisabled) {
  return new Promise((resolve, reject) => {
    getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000')
    .then((sessionToken) => {
      return appTest.get('/api/token/submission')
      .set('session-token', sessionToken)
    })
    .then((response) => {
      let submissionToken = response.body.token
      resolve(validateTokenService.verifyToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000', submissionToken))
    })
  })
}

describe('FHIR validator test', () => {
  it('should correctly validate a valid FHIR object', () => {
    return getDecoded()
    .then((decoded) => {
      validFhirMessage.identifier[0].value = decoded.submissionId
      let result = fhirValidator.validate(validFhirMessage, decoded.submissionId)
      return expect(result).to.have.property('isValid', true)
    })
  })

  it('should not validate an invalid FHIR object', () => {
    return getDecoded()
    .then((decoded) => {
      let result = fhirValidator.validate(validFhirMessage, decoded.submissionId)
      return expect(result).to.have.property('isValid', false)
    })
  })
})
