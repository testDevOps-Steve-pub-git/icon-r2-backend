'use strict'

const service = `${__base}/server/services/access/reset`
const processType = require(`${__base}/server/models/process-type`).ACCESS.RESET_ACCESS

function createCallbackUrl (protocol, host, path) {
  return `https://${host}/#!/${path}`
}

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.body.oiid,
      email: req.body.email,
      lang: req.body.lang,
      callbackUrl: createCallbackUrl(req.protocol,
                                    (req.headers.hostname || req.headers.host), // Hostname is populated in nginx
                                    req.body.callbackUrl),
      phuId: req.body.phuId,
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
