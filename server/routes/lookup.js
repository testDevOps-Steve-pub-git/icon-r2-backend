var http = require('http')

var logger = require(`${__base}/server/logger`)
var tokenHeaders = require(`${__base}/server/models/token-headers`)

module.exports = function lookup (req, res, next) {
  var validationType = 0
  var range = '0-10'
  if (req.params.indexName === 'diseases_en_index' || req.params.indexName === 'diseases_fr_index') {
    validationType = 1
    range = '0-16'
  }

  var lookupToken
  if (validationType === 1) {
    lookupToken = tokenHeaders.getSessionToken(req.headers)
  } else {
    lookupToken = req.headers['authorization']
  }

  var headers = {
    'Authorization': 'Bearer ' + lookupToken,
    'Range': range,
    'Range-Units': 'items',
    'Prefer': 'count=none'
  }

  var options = {
    host: 'pg-lookups-rest-service',
    port: 3000,
    path: req.params.indexName + req._parsedUrl.search,
    method: 'GET',
    headers: headers
  }

  var creq = http.request(options, function (cres) {
    cres.setEncoding('utf8')

    res.writeHead(cres.statusCode)

            // wait for data
    cres.on('data', function (chunk) {
      res.write(chunk)
    })

    cres.on('close', function () {
                // closed, let's end client request as well
      res.end()
    })

    cres.on('end', function () {
                // finished, let's finish client request as well
      res.end()
    })
  }).on('error', function (e) {
            // we got an error, return 500 error to client and log error
    var metaObject = {
      phuName: req.decoded.phuName,
      phuAcronym: req.decoded.phuAcronym,
      sessionId: req.decoded.sessionId,
      clientip: req.decoded.clientip
    }
            // If submission id is defined then only add to metaObject
    if (typeof req.decoded.txId !== 'undefined') {
      metaObject = Object.assign(metaObject, {
        submissionId: req.decoded.txId
      })
    }

    logger.log('error', Object.assign({
      processType: 'lookup',
      message: 'error: ' + e.message + ' with status code: 500'
    }, metaObject))
    res.writeHead(500)
    res.end()
  })

  creq.end()
}
