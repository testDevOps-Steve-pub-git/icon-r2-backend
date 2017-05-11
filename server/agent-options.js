const fs = require('fs')
module.exports = {
  /**
   * Build agentOptions adding certs
   * @param {object} certs - key/value of certs and paths
   * @param {object} onError - error callback (can be called more than once)
   */
  build: function (certs, onError) {
    let agentOptions = {}

    if (certs) {
      Object.keys(certs).forEach(function (key) {
        // if we can't load one cert, keep loading the remainder
        try {
          if (certs[key]) {
            agentOptions[key] = fs.readFileSync(certs[key], 'utf8')
          }
        } catch (err) {
          if (onError) {
            onError(err)
          }
        }
      })
    }

    return agentOptions
  }
}
