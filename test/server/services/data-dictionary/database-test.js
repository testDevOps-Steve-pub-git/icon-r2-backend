'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire').noPreserveCache()

chai.use(chaiAsPromised)
const expect = chai.expect

const config = `${__base}/config.js`
const logger = `${__base}/server/services/logger-service`
const subjectPath = `${__base}/server/services/data-dictionary/database`

const err = new Error('test')

let proxies = {
  pg: {},
  [`${config}`]: {
    postgres: {
      writer: 'pg-writer'
    }
  },
  [`${logger}`]: {
    logDebug: () => {}
  }
}

describe('With data-dictionary/database', () => {
  describe('When trying to connect to the database', () => {
    it('should resolve client when no errors', (done) => {
      let subject = proxyquire(subjectPath, Object.assign({}, proxies, {
        pg: {
          Client: function (uri) {
            this.connect = (callback) => { callback(null, {}) }
          }}}
      ))
      expect(subject.connect()).to.become({})
      done()
    })

    it('should reject when errors are returned', (done) => {
      let subject = proxyquire(subjectPath, Object.assign({}, proxies, {
        pg: {
          Client: function (uri) {
            this.connect = (callback) => { callback(err, null) }
          }}}
      ))
      expect(subject.connect()).to.be.rejectedWith(err)
      done()
    })
  })

  describe('When trying to get process lock', () => {
    it('should resolve client when no errors and rows found', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      let mockClient = {
        query: function (sql, callback) { callback(null, {rows: [1]}) }
      }
      expect(subject.lock(mockClient)).to.become(mockClient)
      done()
    })

    it('should reject when it cant get a process lock', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      let mockClient = {
        query: function (sql, callback) { callback(err, null) }
      }

      expect(subject.lock(mockClient)).to.be.rejectedWith('Failed to get a lock')
      done()
    })

    it('should reject when it cant get rows to lock', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      let mockClient = {
        query: function (sql, callback) { callback(null, {rows: []}) }
      }

      expect(subject.lock(mockClient)).to.be.rejectedWith('Already updated')
      done()
    })

    it('should reject when it does not receive a client', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      expect(subject.lock(null)).to.be.rejectedWith('Process lock: no client found')
      done()
    })
  })

  describe('When disconnecting', () => {
    it('should resolve when successful', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      let mockClient = {
        end: function (callback) { callback(null) }
      }
      expect(subject.disconnect(mockClient)).to.become(mockClient)
      done()
    })
    it('should reject when fails', (done) => {
      let subject = proxyquire(subjectPath, proxies)
      let err = new Error('failed')
      let mockClient = {
        end: function (callback) { callback(err) }
      }
      expect(subject.disconnect(mockClient)).to.be.rejectedWith(err)
      done()
    })
  })
})

