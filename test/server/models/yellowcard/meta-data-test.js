const expect = require('chai').expect
const metaData = require(`${__base}/server/models/yellowcard/meta-data`)

describe('yellowcard authenticate session test', () => {
  it('should return a correctly formatted session object', () => {
    const result = metaData('PHU_NAME', 'PHU_ACRONYM', 'SESSION_ID', 'CLIENT_IP')
    return expect(result).to.have.property('clientip', 'CLIENT_IP')
  })
})
