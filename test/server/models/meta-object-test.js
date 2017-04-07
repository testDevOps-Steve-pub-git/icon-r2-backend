var expect = require('chai').expect
var metaObject = require(__base + '/server/models/meta-object.js')

describe('meta object test', () => {
  let testObj = {
    phuName: 'Grey Bruce Health Unit',
    phuAcronym: 'GBHU',
    sessionId: 'test_session',
    txId: 'test_submission',
    clientip: 'test_client'
  }

  it('should return meta object', () => {
    let result = metaObject(testObj)
    return expect(result.clientip)
    .to.equal('test_client')
  })
})
