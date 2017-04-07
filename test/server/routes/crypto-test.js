var chai = require('chai')
var expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var crypto = require(__base + '/server/routes/crypto')

describe('crypto test', () => {
  let incompleteReq = {
    testTest: 'test_req'
  }

  let defaultRes = {
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
})
