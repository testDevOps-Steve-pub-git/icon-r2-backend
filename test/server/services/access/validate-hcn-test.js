const chai = require('chai')
const expect = chai.expect
const validateHcn = require(`${__base}/server/services/access/validate-hcn.js`)

const testSessionToken = 'asdq43sdf2342'

let responseObject = {
  sessionToken: testSessionToken
}

describe('validate-hcn test', () => {
  let req = validateHcn(responseObject)

  it('should return correct header', () => {
    expect(req.headers.Submission_Context).to.equal('Bearer ' + testSessionToken)
  })
})
