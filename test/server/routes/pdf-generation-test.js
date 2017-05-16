const proxyquire = require('proxyquire')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const examplePdfContent = require(`${__base}/test/server/testFiles/pdf/pdf-example.js`)
const getTokenService = require(`${__base}/server/services/token/get-token-service.js`)
const TOKEN_TYPE = require(`${__base}/server/models/token-type`)
const pdfServicePath = `${__base}/server/services/pdf-service`
const loggerPath = `${__base}/server/logger`

const generatePdfSpy = sinon.spy((dataIn) => {
  const Readable = require('stream').Readable
  let readStream = new Readable()
  readStream.push(JSON.stringify(dataIn))
  return readStream
})

const loggerInfoSpy = sinon.spy(() => { })

const generatePdfRouter = proxyquire(`${__base}/server/routes/pdf-generation.js`, {
  [`${pdfServicePath}`]: {
    generatePdf: generatePdfSpy
  },
  [`${loggerPath}`]: {
    info: loggerInfoSpy,
    '@global': true
  }
})

let resObject = httpMocks.createResponse()

describe('pdf generation router test', () => {
  it('should call pdf service with given parameters', () => {
    let requestObject = httpMocks.createRequest({
      body: JSON.parse(examplePdfContent)
    })

    return Promise
      .all([
        getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000'),
        getTokenService.createToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vpac.me:3000')
      ])
      .then(([sessionToken, submissionToken]) => {
        requestObject['session-token'] = sessionToken
        requestObject['submission-token'] = submissionToken
        generatePdfRouter(requestObject, resObject)
      })
      .then(() => {
        sinon.assert.calledOnce(generatePdfSpy)
        sinon.assert.calledWithExactly(generatePdfSpy, JSON.parse(examplePdfContent))
      })
  })

  it('should log error when called without content in body', () => {
    // Reset called count on logger spy
    loggerInfoSpy.reset()

    let requestObject = {
      'content-type': 'application/json',
      body: { content: null }
    }

    return Promise
      .all([
        getTokenService.createToken(TOKEN_TYPE.SESSION, 'gbhu.vpac.me:3000'),
        getTokenService.createToken(TOKEN_TYPE.SUBMISSION, 'gbhu.vpac.me:3000')
      ])
      .then(([sessionToken, submissionToken]) => {
        requestObject['session-token'] = sessionToken
        requestObject['submission-token'] = submissionToken
        return generatePdfRouter(requestObject, resObject)
      })
      .then(() => {
        sinon.assert.calledTwice(loggerInfoSpy)
      })
  })
})
