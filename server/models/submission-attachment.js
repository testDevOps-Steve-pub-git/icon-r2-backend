'use strict'

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
    ctx.req.files &&
    ctx.req.files[0])
}

function setData (ctx) {
  ctx.args.data = {
    transactionId: ctx.req.decoded.txId,
    fileMimeType: ctx.req.files[0].mimetype,
    originalFilename: ctx.req.files[0].originalname,
    fileContent: ctx.req.files[0].buffer
  }
}

module.exports = (SubmissionAttachment) => {
  commonPost(SubmissionAttachment, {
    isValid: isValid,
    setData: setData,
    processType: processTypes.FILE_UPLOAD
  })
}
