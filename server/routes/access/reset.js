'use strict'

const service = `${__base}/server/services/access/reset`
const processType = require(`${__base}/server/models/process-type`).ACCESS.RESET_ACCESS

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.body.oiid,
      email: req.body.email,
      lang: req.body.lang,
      callbackUrl: req.body.callbackUrl,
      phuId: req.body.phuId,
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
