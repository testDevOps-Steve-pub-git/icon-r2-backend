const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const httpVirusScanner = require(`${__base}/server/services/http-virus-scanner`)

describe('Virus Scanner', () => {
  it('should error when file is not found', () => {
    expect(httpVirusScanner(null)).to.be.rejectedWith('No file found')
  })
})
