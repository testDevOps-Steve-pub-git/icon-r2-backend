'use strict'

const service = `${__base}/server/services/access/validate-hcn`
const processType = require(`${__base}/server/models/process-type`).ACCESS.VALIDATE_HCN

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.body.oiid,
      hcn: req.body.hcn,
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
