const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const token = require(`${__base}/server/routes/token.js`)
const getTokenService = require(`${__base}/server/services/token/get-token-service`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)

chai.use(chaiAsPromised)
const expect = chai.expect

describe('token test', () => {
  const sessionTest = {
    decoded: '',
    headers: {
      origin: 'gbhu.vcap.me:3000',
      referer: 'test_referer',
      host: 'test_host'
    }
  }

  const submissionTest = {
    decoded: '',
    headers: {
      origin: 'gbhu.vcap.me:3000',
      referer: 'test_referer',
      host: 'test_host'
    }
  }

  Promise.resolve(getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000')).then((token) => {
    sessionTest.headers['session-token'] = token
    submissionTest.headers['session-token'] = token
  })

  Promise.resolve(getTokenService.createToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vpac.me:3000')).then((token) => {
    submissionTest.headers['submission-token'] = token
  })

  it('should authenticate a valid session token', () => {
    return expect(Promise.resolve(token.authenticateSessionAndSubmissionToken[0](sessionTest)))
    .to.eventually.be.fulfilled
  })

  it('should authenticate a valid submission token', () => {
    return expect(Promise.resolve(token.authenticateSessionAndSubmissionToken[1](submissionTest)))
    .to.eventually.be.fulfilled
  })
})
