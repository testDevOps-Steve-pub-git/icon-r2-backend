const expect = require('chai').expect
const client = require(`${__base}/server/models/yellowcard/authenticate/client`)

describe('yellowcard authenticate client test', () => {
  it('should return a correctly formatted client object', () => {
    const result = client('OOID', 'PIN', 'RELATIONSHIP_TO_CLIENT', 'LANGUAGE')
    return expect(result).to.have.property('relationship', 'RELATIONSHIP_TO_CLIENT')
  })
})
