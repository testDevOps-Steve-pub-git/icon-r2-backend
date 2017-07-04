const expect = require('chai').expect
const logger = `${__base}/server/logger`
const proxyquire = require('proxyquire')

const crypto = proxyquire(`${__base}/server/services/crypto.js`, {
  [`${logger}`]: {
    debug: () => {}
  }
})

describe('crypto test', () => {
  let encryptedFile

  const validConfig = {
    algorithm: 'aes192',
    password: 'test_password'
  }

  const configWithBadCipher = {
    algorithm: 'invalid_algorithm',
    password: 'test_password'
  }

  const configWithBadPassword = {
    algorithm: 'aes192',
    password: null
  }

  describe('when encrypting', () => {
    it('should encrypt a buffer when given valid configuration', () => {
      return crypto.encrypt('test', validConfig)
      .then((result) => {
        encryptedFile = result
        return expect(encryptedFile).to.be.defined
      })
    })

    it('should not encrypt a buffer when given an invalid password', () => {
      crypto.encrypt('test', configWithBadPassword)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })

    it('should not encrypt a buffer when given an invalid algorithm', () => {
      crypto.encrypt('test', configWithBadCipher)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })
  })

  describe('when decrypting', () => {
    it('should correctly decrypt an encrypted file', () => {
      return crypto.decrypt(encryptedFile, validConfig)
      .then((result) => {
        return expect(result.toString()).to.equal('test')
      })
    })

    it('should not encrypt a buffer when given an invalid password', () => {
      return crypto.decrypt(encryptedFile, configWithBadPassword)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })

    it('should not encrypt a buffer when given an invalid algorithm', () => {
      return crypto.decrypt(encryptedFile, configWithBadCipher)
      .catch((err) => {
        return expect(err).to.be.defined
      })
    })
  })
})
