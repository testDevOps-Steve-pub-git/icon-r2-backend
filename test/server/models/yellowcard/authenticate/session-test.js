const expect = require('chai').expect
const session = require(`${__base}/server/models/yellowcard/authenticate/session`)

describe('yellowcard authenticate session test', () => {
  it('should return a correctly formatted session object', () => {
    const result = session('SESSION_ID', 'CLIENT_IP', 'TOKEN', 'PHU_NAME', 'PHU_ACRONYM',
                         'OIID', 'PIN', 'RELATIONSHIP_TO_CLIENT', 'LANGUAGE')
    return expect(result).to.have.property('token', 'TOKEN')
  })
})
