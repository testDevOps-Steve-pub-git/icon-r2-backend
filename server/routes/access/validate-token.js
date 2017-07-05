'use strict'

const service = `${__base}/server/services/access/validate-token`
const processType = require(`${__base}/server/models/process-type`).ACCESS.VALIDATE_TOKEN

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      token: req.body.token,
      sessionToken: req.headers['session-token']
    }
  }

  next()
}
