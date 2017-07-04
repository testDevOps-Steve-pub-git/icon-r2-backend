'use strict'
const ycModels = require(`${__base}/server/models/yellowcard/models`)
const ycService = require(`${__base}/server/services/yellowcard-service`)
const errorService = require(`${__base}/server/services/error-service`)

/**
 * YellowCard: getClient() Method
 *
 * @desc   This function will authenticate whether a client has input
 *         a valid oiid (ontario immunization identifier), co-insiding
 *         pin, and relationship to retrieve a real yellowcard from the MOH Server
 *
 * @param {request}  req  - the request object from the node server
 */
function getSession (req) {
  const check = {
    hasOiid: (!!req.headers['oiid']),
    hasPin: (!!req.headers['immunizations-context'] || !!req.query['immunizations-context']),
    hasRelationship: (!!req.params['relationshipToClient'] || !!req.query['relationshipToClient'])
  }

  if (check.hasRelationship && check.hasOiid && check.hasPin) {
    return ({
      isValid: true,
      message: ycModels.MESSAGES.AUTHENTICATE.SUCCESS,
      session: ycService.authenticate.create.session(
                  req.decoded.sessionId,
                  req.decoded.clientip,
                  (req.headers['session-token'] || req.query['session-token']),
                  req.decoded.phuName,
                  req.decoded.phuAcronym,
                  req.headers['oiid'],
                  (req.headers['immunizations-context'] || req.query['immunizations-context']),
                  (req.params['relationshipToClient'] || req.query['relationshipToClient']),
                  (req.headers['lang'] || req.query['lang'])
                )
    })
  } else {
    return ({
      isValid: false,
      message: ycService.authenticate.create.errorMessage(check),
      session: null
    })
  }
}

/**
 * YellowCard: authenticateRequest() Method
 *
 * @desc   This function will authenticate whether a client has input
 *         a valid oiid (ontario immunization identifier) and co-insiding
 *         pin to retrieve a real yellowcard from the MOH Server
 *
 * @param {request}  req        - the request object from the node server
 * @param {response} res        - the response object from the node server
 * @param {next}     next       - the next callback in the chain
 */
module.exports = (req, res, next) => {
  const check = getSession(req)

  if (check.isValid) {
    req.session = check.session
    next()
  } else {
    res.writeHead(ycModels.STATUS_CODES.BAD_REQUEST)
    res.end()

    throw errorService.IconCustomError(check.message, {
      decoded: req.decoded,
      processType: ycModels.TYPES.PROCESSES.AUTHENTICATE,
      statusCode: ycModels.STATUS_CODES.BAD_REQUEST
    })
  }
}
