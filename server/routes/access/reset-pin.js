'use strict'

const service = `${__base}/server/services/access/reset-pin`
const processType = require(`${__base}/server/models/process-type`).ACCESS.RESET_PIN

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.body.oiid,
      token: req.body.token,
      role: req.body.role,
      pin: req.body['immunizations-context'],
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
