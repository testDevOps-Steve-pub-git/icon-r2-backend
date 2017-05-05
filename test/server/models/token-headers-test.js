const expect = require('chai').expect
const tokenHeaders = require(__base + '/server/models/token-headers.js')

describe('token headers test', () => {
  const headers = {
    origin: 'test_origin',
    referer: 'test_referer',
    host: 'test_host',
    'session-token': 'test_session_token',
    'submission-token': 'test_submission_token',
    'x-access-token': 'test_x_access_token',
    'x-real-ip': 'text_x_real_ip'
  }

  const refererTest = {
    referer: 'test_referer'
  }

  const hostTest = {
    host: 'test_host'
  }

  it('should get host (origin) from headers', () => {
    return expect(tokenHeaders.getHost(headers))
    .to.equal('test_origin')
  })

  it('should get host (referer) from headers', () => {
    return expect(tokenHeaders.getHost(refererTest))
    .to.equal('test_referer')
  })

  it('should get host (host) from headers', () => {
    return expect(tokenHeaders.getHost(hostTest))
    .to.equal('test_host')
  })

  it('should get session token from headers', () => {
    return expect(tokenHeaders.getSessionToken(headers))
    .to.equal('test_session_token')
  })

  it('should get submission token from headers', () => {
    return expect(tokenHeaders.getSubmissionToken(headers))
    .to.equal('test_submission_token')
  })

  it('should get ip from headers', () => {
    return expect(tokenHeaders.getIp(headers))
    .to.equal('text_x_real_ip')
  })
})
