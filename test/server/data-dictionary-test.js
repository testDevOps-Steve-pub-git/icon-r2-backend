'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const proxyquire = require('proxyquire').noPreserveCache()
const Promise = require('bluebird')

chai.use(chaiAsPromised)
const expect = chai.expect

const db = `${__base}/server/services/data-dictionary/database`
const importDomains = `${__base}/server/services/data-dictionary/domains`
const subjectPath = `${__base}/server/services/data-dictionary`

const err = new Error('test')
const resolve = () => { return Promise.resolve(true) }
const reject = () => { return Promise.reject(err) }

function proxySubject (options = {}) {
  let proxies = {
    [`${db}`]: {
      connect: options.connect ? options.connect : resolve,
      lock: options.lock ? options.lock : resolve,
      unlock: options.unlock ? options.unlock : resolve,
      disconnect: options.disconnect ? options.disconnect : resolve
    },
    [`${importDomains}`]: options.importDomains ? options.importDomains : resolve
  }

  return proxyquire(subjectPath, proxies)
}

describe('With data-dictionary', () => {
  describe('when everything works', () => {
    it('should successfully import', () => {
      let subject = proxySubject()
      return expect(subject()).to.be.fulfilled
    })
  })

  describe('when database fails connection', () => {
    it('should fail import', () => {
      let subject = proxySubject({connect: reject})
      return expect(subject()).to.be.rejectedWith(err)
    })
  })

  describe('when import domains fails', () => {
    it('should fail import', () => {
      let subject = proxySubject({importDomains: reject})
      return expect(subject()).to.be.rejectedWith(err)
    })
  })
})
