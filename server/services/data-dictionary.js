'use strict'

const importDomains = require(`${__base}/server/services/data-dictionary/domains`)
const db = require(`${__base}/server/services/data-dictionary/database`)

module.exports = () => {
  return db.connect()
  .then(db.lock)
  .then(importDomains)
  .then(db.unlock)
  .then(db.disconnect)
}
