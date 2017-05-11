const expect = require('chai').expect
const app = require(`${__base}/server/server`)
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

describe('Token API', () => {
  let sessionToken

  it('should generate a session token', () => {
    return appTest.get('/api/token/session')
    .then((response) => {
      if (response.body && response.body.token) {
        sessionToken = response.body.token
        return expect(response.body).to.have.property('token')
      }
    })
  })

  it('should generate a submission token', () => {
    return appTest.get('/api/token/submission')
    .set('session-token', sessionToken)
    .then((response) => {
      if (response.body) {
        return expect(response.body).to.have.property('token')
      }
    })
  })

  it('should refresh a session token', () => {
    return appTest.get('/api/token/session')
    .then(appTest.get('/api/refresh/session'))
    .then((response) => {
      return expect(response.body).to.have.property('token')
    })
  })

  it('should refresh a submission token', () => {
    return appTest.get('/api/token/submission')
    .set('session-token', sessionToken)
    .then(appTest.get('/api/refresh/submission'))
    .then((response) => {
      return expect(response.body).to.have.property('token')
    })
  })
})
