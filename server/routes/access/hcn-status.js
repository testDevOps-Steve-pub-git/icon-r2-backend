'use strict'

const service = `${__base}/server/services/access/hcn-status`
const processType = require(`${__base}/server/models/process-type`).ACCESS.HCN_STATUS

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.headers.oiid,
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
