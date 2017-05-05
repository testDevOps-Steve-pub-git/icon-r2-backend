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
    auditLog: () => {
      return Promise.resolve()
    },
    '@global': true
  }
}

const app = proxyquire(`${__base}/server/server`, stubs)
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

const appTest = createVhostTester(app, 'gbhu.vpac.me:3000')

describe('tracking api', () => {
  it('should create audit log succesfully when called', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000').then((sessionToken) => {
      return appTest.post('/api/tracking')
        .set('session-token', sessionToken)
        .expect(202)
    })
  })
})
