var expect = require('chai').expect
var session = require(`${__base}/server/models/yellowcard/authenticate/session`)

describe('yellowcard authenticate session test', () => {
  it('should return a correctly formatted session object', () => {
    let result = session('SESSION_ID', 'CLIENT_IP', 'TOKEN', 'PHU_NAME', 'PHU_ACRONYM',
                         'OIID', 'PIN', 'RELATIONSHIP_TO_CLIENT', 'LANGUAGE')
    return expect(result).to.have.property('token', 'TOKEN')
  })
})
