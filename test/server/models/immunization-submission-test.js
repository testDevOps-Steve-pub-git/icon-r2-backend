var expect = require('chai').expect
var proxyquire = require('proxyquire')
var logger = `${__base}/server/logger`
var getTokenService = require(`${__base}/server/services/token/get-token-service.js`)
var validateTokenService = require(`${__base}/server/services/token/validate-token-service.js`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)
const validFhirMessage = require(`${__base}/test/server/testFiles/immunization-submission/ImmunizationSubmission.json`)
const invalidFhirMessage = require(`${__base}/test/server/testFiles/immunization-submission/ImmunizationSubmission.bad.json`)

var stubs = {
  'clamav.js': {
    createScanner: (post, endPoint) => {
      return { scan: (buffer, cb) => {
        cb(null, buffer, null)
      }}
    },
    version: () => {
      return true
    }
  },
  [`${logger}`]: {
    error: () => {},
    debug: () => {},
    info: () => {},
    '@global': true
  }
}

var app = proxyquire(`${__base}/server/server`, stubs)
var request = require('supertest-as-promised')(app)

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

var appTest = createVhostTester(app, 'gbhu.vpac.me:3000')

describe('post immunization submission api', () => {
  it('should be able to get the submission token', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')
    .then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken)
        .then((response) => {
          expect(response.body.token).to.exist
        })
    })
  })

  it('should be not able to post immunization without valid fhir message', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')
    .then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken)
        .then((response) => {
          let submissionToken = response.body.token
          return appTest.post('/api/ImmunizationSubmissions')
            .set('session-token', sessionToken)
            .set('submission-token', submissionToken)
            .set('x-access-token', 'test_x_access_token')
          .expect(422)
        })
    })
  })

  it('should be able to post immunization with valid fhir object', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')
    .then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken)
        .then((response) => {
          let submissionToken = response.body.token
          return validateTokenService.verifyToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vpac.me:3000', submissionToken)
          .then((decoded) => {
            validFhirMessage.identifier[0].value = decoded.submissionId
            return appTest.post('/api/ImmunizationSubmissions')
              .set('session-token', sessionToken)
              .set('submission-token', submissionToken)
              .set('x-access-token', 'test_x_access_token')
              .send(validFhirMessage)
            .expect(201)
          })
        })
    })
  })

  it('should not be able to post immunization with invalid fhir object', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')
    .then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken)
        .then((response) => {
          let submissionToken = response.body.token
          return appTest.post('/api/ImmunizationSubmissions')
            .set('session-token', sessionToken)
            .set('submission-token', submissionToken)
            .set('x-access-token', 'test_x_access_token')
            .send(invalidFhirMessage)
          .expect(422)
        })
    })
  })

  it('should not be be able to post immunization without valid headers', () => {
    return appTest.post('/api/ImmunizationSubmissions')
      .expect(500)
  })
})
