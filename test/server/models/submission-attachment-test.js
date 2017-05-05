process.env.NODE_ENV = 'test'

const path = require('path')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const logger = `${__base}/server/logger`
const getTokenService = require(`${__base}/server/services/token/get-token-service.js`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

const stubs = {
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

const app = proxyquire(__base + '/server/server', stubs)
const request = require('supertest-as-promised')(app)

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

const appTest = createVhostTester(app, 'gbhu.vcap.me:3000')

describe('submission attachment test', () => {
  it('should submit attachments', () => {
    const testFilePath = path.resolve('test/server/testFiles/pinkball.png')
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000').then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken).then((response) => {
          const submissionToken = response.body.token
          return appTest.post('/api/SubmissionAttachments')
            .set('session-token', sessionToken)
            .set('submission-token', submissionToken)
            .set('x-access-token', 'test_x_access_token')
            .set('Content-type', 'application/json')
            .attach('files', testFilePath)
            .expect(201)
        })
    })
  })

  it('should not submit empty request', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vcap.me:3000').then((sessionToken) => {
      return appTest.get('/api/token/submission')
        .set('session-token', sessionToken).then((response) => {
          const submissionToken = response.body.token
          try {
            appTest.post('/api/SubmissionAttachments')
              .set('session-token', sessionToken)
              .set('submission-token', submissionToken)
              .set('x-access-token', 'test_x_access_token')
              .set('Content-type', 'application/json')
              .expect(500)
          } catch (err) {
            return expect(err).to.exist
          }
        })
    })
  })
})
