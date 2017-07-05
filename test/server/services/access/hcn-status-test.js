const chai = require('chai')
const expect = chai.expect
const hcnStatus = require(`${__base}/server/services/access/hcn-status.js`)

const testOiid = 'XM2XBFXMB2'
const testSessionToken = 'asdq43sdf2342'

let options = {
  oiid: testOiid,
  sessionToken: testSessionToken
}

describe('hcn-status test', () => {
  const response = hcnStatus(options)
  const headers = response.headers

  it('should return correct headers', () => {
    expect(headers.oiid).to.equal(testOiid)
    expect(headers.Submission_Context).to.equal(`Bearer ${testSessionToken}`)
  })
})
