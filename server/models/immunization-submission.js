'use strict'

const errorHandler = require(`${__base}/server/services/error-service`)
const statusCodes = require(`${__base}/server/models/response-status-code`)
const processTypes = require(`${__base}/server/models/process-type`)
const commonPost = require(`${__base}/server/models/common-post`)

/**
 * @function Check the ctx object contains all the data we need
 * @return {{bool} result} Return true if we have it, otherwise, false
 */
function isValid (ctx) {
  return !!(ctx &&
    ctx.req &&
    ctx.req.decoded &&
    ctx.req.decoded.txId &&
    ctx.req.body)
}

/*
 * @function put the transformed data back into the request object
 * for strongloop to save
 */
function setData (ctx, data) {
  ctx.args.data = {
    transactionId: ctx.req.decoded.txId,
    transactionToken: ctx.req.decoded.submissionToken,
    sessionId: ctx.req.decoded.sessionId,
    objectVersion: ctx.req.headers.FHIR_Version || 'DSTU3',
    objectProfile: ctx.req.headers.FHIR_Profile || 'ICON_R2',
    immunObject: ctx.req.encryptedBody
  }
}

function addMessage (ctx) {
  ctx.Model.app.addToQueue({
    id: ctx.instance.id
  })
}

module.exports = (ImmunizationSubmission) => {
  commonPost(ImmunizationSubmission, {
    isValid: isValid,
    setData: setData,
    processType: processTypes.ICON
  })

  ImmunizationSubmission.observe('after save', function (ctx, next) {
    try {
      if (ctx.instance) {
        if (ctx.isNewInstance) {
          addMessage(ctx)
        }
      } else {
        throw new Error('Save failed')
      }
      next()
    } catch (err) {
      next(errorHandler.IconCustomError(err, {
        processType: processTypes.ICON,
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        decoded: {}
      }))
    }
  })
}
