const chai = require('chai')
const expect = chai.expect
const pinStatus = require(`${__base}/server/services/access/pin-status.js`)

const testOiid = 'XM2XBFXMB2'
const testSessionToken = 'asdq43sdf2342'

let responseObject = {
  oiid: testOiid,
  sessionToken: testSessionToken
}

describe('pin-status test', () => {
  let req = pinStatus(responseObject)

  it('should return correct headers', () => {
    expect(req.headers.oiid).to.equal(testOiid)
    expect(req.headers.Submission_Context).to.equal('Bearer ' + testSessionToken)
  })
})
