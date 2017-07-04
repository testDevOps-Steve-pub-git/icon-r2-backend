'use strict'

const service = `${__base}/server/services/access/set-pin`
const processType = require(`${__base}/server/models/process-type`).ACCESS.SET_PIN

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.body.oiid,
      hcn: req.body.hcn,
      email: req.body.email,
      pin: req.body['immunizations-context'],
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
