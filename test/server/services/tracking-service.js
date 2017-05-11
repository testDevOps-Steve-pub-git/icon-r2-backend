const expect = require('chai').expect
const sinon = require('sinon')
const Promise = require('bluebird')
const proxyquire = require('proxyquire').noPreserveCache()
const logger = `${__base}/server/logger`
const config = `${__base}/config.js`
const subjectPath = `${__base}/server/services/tracking-service`

function serviceEnabled (enabled) {
  return {
    elasticSearch: {
      url: esUrl
    },
    tracking: {
      updateTimeService: {
        enabled: enabled,
        typeToUpdate: 'log'
      }
    }
  }
}

const esUrl = 'http://elasticsearch/'
const duration = 10
const logs = `{
  "hits": {
    "hits": [
      {
        "_id": 1,
        "_index": 1,
        "_source": {
          "fields": {
            "timestamp": ${Date.now()}
          }
        }
      },
      {
        "_id": 2,
        "_index": 2,
        "_source": {
          "fields": {
            "timestamp": ${Date.now() - duration * 1000}
          }
        }
      }
    ]
  }
}`

const loggerInfoSpy = sinon.spy(() => { })
const loggerErrorSpy = sinon.spy(() => { })

const defaultProxies = {
  [`${logger}`]: {
    info: loggerInfoSpy,
    error: loggerErrorSpy
  },
  [`${config}`]: serviceEnabled(true),
  'request-promise': {
    post: () => { Promise.resolve({}) }
  }
}

function respec (newProxies) {
  return proxyquire(subjectPath, Object.assign({}, defaultProxies, newProxies))
}

const sessionId = 1
const timestamp = 1
let subject = proxyquire(subjectPath, defaultProxies)

describe('tracking service', () => {
  it('should not run when missing parameters', () => {
    expect(subject.updateComponentTime(undefined, timestamp)).to.be.undefined
    expect(subject.updateComponentTime(sessionId, undefined)).to.be.undefined
    expect(subject.updateSessionTime(undefined, timestamp)).to.be.undefined
    return expect(subject.updateSessionTime(sessionId, undefined)).to.be.undefined
  })

  it('should not run when disabled in config', () => {
    subject = respec({
      [`${config}`]: serviceEnabled(false)
    })
    expect(subject.updateComponentTime(sessionId, timestamp)).to.be.undefined
    return expect(subject.updateSessionTime(sessionId, timestamp)).to.be.undefined
  })

  it('should log error with malformed response from Elasticsearch', () => {
    let callback = sinon.stub()
    callback.onFirstCall().returns(Promise.resolve('not json @#$@'))
    callback.onSecondCall().returns(Promise.resolve('also not json @#$@'))
    subject = respec({
      'request-promise': { post: callback }
    })
    subject.updateComponentTime(sessionId, timestamp)
    expect(loggerErrorSpy).to.be.calledOnce

    loggerErrorSpy.reset()
    subject.updateSessionTime(sessionId, timestamp)
    return expect(loggerErrorSpy).to.be.calledOnce
  })

  describe('updateComponentTime', () => {
    it('should retrieve but not update when no matching logs are found', () => {
      let callback = sinon.stub()
      callback.onFirstCall().returns(Promise.resolve('{"first": 1}')) // get logs
      subject = respec({
        'request-promise': { post: callback }
      })

      let requestObject = { uri: `${esUrl}*/_search`,
        'content-type': 'application/json',
        body: `{"query":{"bool":{"must":{"term":{"fields.sessionId":${sessionId}}},"filter":{"range":{"fields.timestamp":{"lte":1}}},"must_not":{"missing":{"field":"fields.transitionPage","existence":true,"null_value":true}}}},"sort":{"fields.timestamp":{"order":"desc"}},"size":2}`
      }

      return subject.updateComponentTime(sessionId, timestamp)
        .then(() => {
          sinon.assert.calledOnce(callback) // get logs only
          sinon.assert.calledWithExactly(callback, requestObject)
        })
    })

    it('should update when matching logs are found', () => {
      let callback = sinon.stub()
      callback.onFirstCall().returns(Promise.resolve(logs)) // get logs
      callback.onSecondCall().returns(Promise.resolve('{"status": "OK"}')) // update logs
      subject = respec({
        'request-promise': { post: callback }
      })

      let requestObject = {
        uri: `${esUrl}*/_search`,
        'content-type': 'application/json',
        body: `{"query":{"bool":{"must":{"term":{"fields.sessionId":${sessionId}}},"filter":{"range":{"fields.timestamp":{"lte":1}}},"must_not":{"missing":{"field":"fields.transitionPage","existence":true,"null_value":true}}}},"sort":{"fields.timestamp":{"order":"desc"}},"size":2}`
      }

      let updateObject = {
        uri: `${esUrl}2/log/2/_update`,
        'content-type': 'application/json',
        body: `{"doc":{"fields":{"duration":${duration}}}}`
      }

      return subject.updateComponentTime(sessionId, timestamp)
      .then(() => {
        sinon.assert.calledTwice(callback)
        sinon.assert.calledWithExactly(callback, requestObject)
        sinon.assert.calledWithExactly(callback, updateObject)
      })
    })
  })

  describe('updateSessionTime', () => {
    it('should retrieve but not update when no matching logs are found', () => {
      let callback = sinon.stub()
      callback.onFirstCall().returns(Promise.resolve('{"first": 1}')) // get logs
      subject = respec({
        'request-promise': { post: callback }
      })

      let requestObject = { uri: `${esUrl}*/_search`,
        'content-type': 'application/json',
        body: `{"query":{"bool":{"must":{"term":{"fields.sessionId":${sessionId}}},"must_not":{"missing":{"field":"fields.transitionPage","existence":true,"null_value":true}}}},"sort":{"fields.timestamp":{"order":"desc"}}}`
      }

      return subject.updateSessionTime(sessionId, timestamp)
        .then(() => {
          sinon.assert.calledOnce(callback) // get logs only
          sinon.assert.calledWithExactly(callback, requestObject)
        })
    })

    it('should update when matching logs are found', () => {
      let callback = sinon.stub()
      callback.onFirstCall().returns(Promise.resolve(logs)) // get logs
      callback.onSecondCall().returns(Promise.resolve('{"status": "OK"}')) // update logs
      subject = respec({
        'request-promise': { post: callback }
      })

      let requestObject = {
        uri: `${esUrl}*/_search`,
        'content-type': 'application/json',
        body: `{"query":{"bool":{"must":{"term":{"fields.sessionId":${sessionId}}},"must_not":{"missing":{"field":"fields.transitionPage","existence":true,"null_value":true}}}},"sort":{"fields.timestamp":{"order":"desc"}}}`
      }

      let updateObject = {
        uri: 'http://elasticsearch/1/log/1/_update',
        'content-type': 'application/json',
        body: `{"doc":{"fields":{"duration":${duration}}}}`
      }

      return subject.updateSessionTime(sessionId, timestamp)
      .then(() => {
        sinon.assert.calledTwice(callback)
        sinon.assert.calledWithExactly(callback, requestObject)
        sinon.assert.calledWithExactly(callback, updateObject)
      })
    })
  })
})
