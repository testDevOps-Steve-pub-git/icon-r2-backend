'use strict'

const pinStatus = require(`${__base}/server/routes/access/pin-status`)
const setPin = require(`${__base}/server/routes/access/set-pin`)
const resetPin = require(`${__base}/server/routes/access/reset-pin`)
const validateHCN = require(`${__base}/server/routes/access/validate-hcn`)
const validateToken = require(`${__base}/server/routes/access/validate-token`)
const reset = require(`${__base}/server/routes/access/reset`)
const token = require(`${__base}/server/routes/token`)
const dhirRouter = require(`${__base}/server/routes/dhir-router`)

module.exports = {
  pinStatus: [token.authenticateSessionToken, pinStatus, dhirRouter],
  setPin: [token.authenticateSessionToken, setPin, dhirRouter],
  resetPin: [token.authenticateSessionToken, resetPin, dhirRouter],
  validateHCN: [token.authenticateSessionToken, validateHCN, dhirRouter],
  validateToken: [token.authenticateSessionToken, validateToken, dhirRouter],
  reset: [token.authenticateSessionToken, reset, dhirRouter]
}
