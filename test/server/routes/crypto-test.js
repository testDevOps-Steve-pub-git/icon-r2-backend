const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const crypto = require(`${__base}/server/routes/crypto`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe('crypto test', () => {
  const incompleteReq = {
    testTest: 'test_req'
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
})
