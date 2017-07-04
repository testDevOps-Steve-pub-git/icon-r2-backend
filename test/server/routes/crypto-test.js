const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const crypto = require(`${__base}/server/routes/crypto`)
const config = require(`${__base}/config`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe('crypto test', () => {
  const incompleteReq = {
    testTest: 'test_req'
  }

  const reqWithBody = {
    body: 'body'
  }

  const defaultRes = {
    port: 3000
  }

  describe('encrypt file upload', () => {
    it('should not encrypt request without files', () => {
      return crypto.encryptFileUpload(incompleteReq, defaultRes, (result) => {
        expect(result).to.have.property('message', 'No file')
      })
    })
  })

  describe('encrypt request body', () => {
    it('should not encrypt request without body', () => {
      return crypto.encryptRequestBody(incompleteReq, defaultRes, (result) => {
        expect(result).to.have.property('message', 'No request body')
      })
    })
  })

  describe('config crypto issues', () => {
    it('should error on file upload if crypto does not have a enabled key', () => {
      config.crypto.enabled = null
      crypto.encryptFileUpload(reqWithBody, defaultRes, (result) => {
        return expect(result).to.be.an('undefined')
      })
    })

    it('should error on request body if crypto does not have a enabled key', () => {
      config.crypto.enabled = null
      crypto.encryptRequestBody(reqWithBody, defaultRes, (result) => {
        return expect(result).to.be.an('undefined')
      })
    })
  })
})
