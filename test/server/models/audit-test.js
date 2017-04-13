const expect = require('chai').expect
const Audit = require(`${__base}/server/models/audit`)

describe('Audit model', () => {
  var audit = new Audit('TEST_PROCESS_TYPE', 200)

  it('should create default audit model', () => {
    expect(audit).to.have.property('timestamp')
    expect(audit).to.have.property('processType')
    expect(audit).to.have.property('responseStatusCode')
    expect(audit).to.have.property('clientip')
    expect(audit).to.have.property('phuName')
    expect(audit).to.have.property('phuAcronym')
    expect(audit).to.have.property('sessionId')
    expect(audit).to.have.property('submissionId')
    expect(audit).to.have.property('message')
    expect(audit).to.have.property('browserName')
    expect(audit).to.have.property('os')
    expect(audit).to.have.property('device')
    expect(audit).to.have.property('location')
    expect(audit).to.have.property('isMobile')
    expect(audit).to.have.property('setLanguage')
    expect(audit).to.have.property('referer')
    expect(audit).to.have.property('fileCount')
    expect(audit).to.have.property('isAuth')
  })

  it('should be editable after creation', () => {
    try {
      audit.timestamp = new Date()
      audit.processType = 'TEST_PROCESS_TYPE'
      audit.statusCode = 999
      audit.clientip = '127.0.0.1'
      audit.phuName = 'Grey Bruce Health Unit'
      audit.phuAcronym = 'GBHU'
      audit.sessionId = 'GBHU-0000'
      audit.submissionId = 'GBHU-0000'
      audit.message = 'TEST_MESSAGE'
      audit.browserName = 'Firefox'
      audit.os = 'Windows 10'
      audit.device = 'TEST_DEVICE'
      audit.location = 'TEST_LOCATION'
      audit.isMobile = false
      audit.setLanuage = 'en'
      audit.referer = 'gbhu.vcap.me'
      audit.fileCount = 2
      audit.isAuth = true
    } catch (err) {
      expect.fail()
    }
  })
})
