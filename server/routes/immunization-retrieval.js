'use strict'

const service = `${__base}/server/services/immunization-retrieval`
const processType = require(`${__base}/server/models/process-type`).RETRIEVAL.RETRIEVAL

module.exports = (req, res, next) => {
  res.locals.dhirRouter = {
    service,
    processType,
    request: {
      oiid: req.headers.oiid,
      context: req.headers['immunizations-context'],
      token: req.headers['session-token']
    }
  }

  next()
}
