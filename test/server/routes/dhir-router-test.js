const proxyquire = require('proxyquire')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
const pinStatusServicePath = `${__base}/server/services/access/pin-status`
const validateHcnServicePath = `${__base}/server/services/access/validate-hcn`
const loggerPath = `${__base}/server/logger`
const PROCESS_TYPE = require(`${__base}/server/models/process-type`).ACCESS

const succesfulRequest = (options) => {
  return {
    statusCode: 200,
    body: {
      resourceType: 'Bundle',
      options: options
    }
  }
}

const failedRequest = (options) => {
  return {
    statusCode: 500,
    request: {
      href: 'PLACEHOLDER_HREF'
    }
  }
}

const serviceSpy = sinon.spy(succesfulRequest)
const failedServiceSpy = sinon.spy(failedRequest)
const auditLoggerSpy = sinon.spy()
const infoLoggerSpy = sinon.spy()
const dhirRouter = proxyquire(`${__base}/server/routes/dhir-router.js`, {
  [`${pinStatusServicePath}`]: serviceSpy,
  [`${validateHcnServicePath}`]: failedServiceSpy,
  [`${loggerPath}`]: {
    auditLog: auditLoggerSpy,
    info: infoLoggerSpy,
    error: () => {}
  },
  '@global': true
})

function createRequestAndResponse (url, servicePath, processType, reqBody) {
  const service = servicePath
  let reqObject = httpMocks.createRequest({
    url: url
  })
  let resObject = httpMocks.createResponse(reqObject)
  resObject.locals = {
    dhirRouter: {
      service,
      processType,
      request: reqBody
    }
  }
  return {
    req: reqObject,
    res: resObject
  }
}

describe('DHIR router test', () => {
  it('should call given service with correct information', () => {
    const reqBody = {
      oiid: 'XKQ3RH8X2M',
      sessionToken: 'PLACEHOLDER_TOKEN'
    }
    const url = 'http://gbhu.vcap.me:6002/api/access/pin-status'

    return Promise.resolve(createRequestAndResponse(url, pinStatusServicePath, PROCESS_TYPE.PIN_STATUS, reqBody))
    .then((reqAndRes) => {
      return dhirRouter(reqAndRes.req, reqAndRes.res)
    })
    .then(() => {
      sinon.assert.calledOnce(serviceSpy)
      sinon.assert.calledWithExactly(serviceSpy, reqBody)
    })
  })

  it('should create an audit log when the access apis are requestd', () => {
    sinon.assert.calledOnce(auditLoggerSpy)
    sinon.assert.calledWith(auditLoggerSpy, PROCESS_TYPE.PIN_STATUS, 200)
  })

  it('should log succesful responses to console as info', () => {
    sinon.assert.calledOnce(infoLoggerSpy)
    sinon.assert.calledWith(infoLoggerSpy, 'Success')
  })

  it('should throw an error when request to DHIR returns anything other than status 200', () => {
    const reqBody = {
      oiid: 'CRTX6N3BMS',
      hcn: '9999999999'
    }
    const url = 'http://gbhu.vcap.me:6002/api/access/validate-hcn'

    return Promise.try(() => {
      return createRequestAndResponse(url, validateHcnServicePath, PROCESS_TYPE.VALIDATE_HCN, reqBody)
    })
    .then((reqAndRes) => {
      return dhirRouter(reqAndRes.req, reqAndRes.res, () => {})
    })
    .then(() => {
      sinon.assert.calledOnce(failedServiceSpy)
      sinon.assert.calledWithExactly(failedServiceSpy, reqBody)
    })
  })
})
