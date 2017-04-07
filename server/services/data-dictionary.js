'use strict'

let importDomains = require(`${__base}/server/services/data-dictionary/domains`)
let db = require(`${__base}/server/services/data-dictionary/database`)

module.exports = () => {
  return db.connect()
  .then(db.lock)
  .then(importDomains)
  .then(db.unlock)
  .then(db.disconnect)
}
