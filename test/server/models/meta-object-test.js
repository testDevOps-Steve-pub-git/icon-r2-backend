const expect = require('chai').expect
const metaObject = require(`${__base}/server/models/meta-object.js`)

describe('meta object test', () => {
  const testObj = {
    phuName: 'Grey Bruce Health Unit',
    phuAcronym: 'GBHU',
    sessionId: 'test_session',
    txId: 'test_submission',
    clientip: 'test_client'
  }

  it('should return meta object', () => {
    const result = metaObject(testObj)
    return expect(result.clientip)
    .to.equal('test_client')
  })
})
