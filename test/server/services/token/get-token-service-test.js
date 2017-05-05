const expect = require('chai').expect
const getTokenService = require(`${__base}/server/services/token/get-token-service`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

describe('get token service test', () => {
  it('should succesfully create a session token given valid inputs', () => {
    return getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')
    .then((result) => {
      return expect(result).to.be.defined
    })
  })

  it('should succesfully create a submission token given valid inputs', () => {
    return getTokenService.createToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vpac.me:3000')
    .then((result) => {
      return expect(result).to.be.defined
    })
  })

  it('should not create a token with invalid url', () => {
    return getTokenService.createToken(TOKEN_TYPE.SUBMISSION, 'INVALID_URL')
    .then((result) => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'url;parse')
    })
  })

  it('should not create a token with invalid token tpe', () => {
    return getTokenService.createToken('INVALID_TOKEN_TYPE', 'gbhu.vpac.me:3000')
    .then((result) => {
      return expect.fail()
    })
    .catch((err) => {
      return expect(err).to.have.property('_processType', 'authenticate')
    })
  })
})
