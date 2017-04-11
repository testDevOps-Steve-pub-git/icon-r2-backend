var obj = require('./services.json')
var fs = require('fs')

var iconelasticsearch = obj['compose-for-elasticsearch'][0]['credentials']['uri']
var iconpostgresql = obj['compose-for-postgresql'][0]['credentials']['uri']
var iconrabbitmq = obj['compose-for-rabbitmq'][0]['credentials']['uri']

var obj1 = require('./userprovided.json')

var JWT_TOKEN_SECRET_KEY = obj1['JWT_TOKEN_SECRET_KEY']
var CRYPTO_PASSWORD = obj1['CRYPTO_PASSWORD']
var POSTGRES_READONLY_ROLE = obj1['POSTGRES_READONLY_ROLE']
var PHIX_ENDPOINT_DICTIONARY = obj1['PHIX_ENDPOINT_DICTIONARY']
var CLAMAV_ENDPOINT = obj1['CLAMAV_ENDPOINT']
var PHIX_ENDPOINT_SUBMISSION = obj1['PHIX_ENDPOINT_SUBMISSION']
var PHIX_ENDPOINT_SUBMISSION_TOKEN = obj1['PHIX_ENDPOINT_SUBMISSION_TOKEN']
var PHIX_ENDPOINT_RETRIEVAL = obj1['PHIX_ENDPOINT_RETRIEVAL']
var PHIX_ENDPOINT_RETRIEVAL_TOKEN = obj1['PHIX_ENDPOINT_RETRIEVAL_TOKEN']

var json = {
  'icon-elasticsearch': iconelasticsearch,
  'icon-postgresql': iconpostgresql,
  'icon-rabbitmq': iconrabbitmq,
  JWT_TOKEN_SECRET_KEY,
  CRYPTO_PASSWORD,
  POSTGRES_READONLY_ROLE,
  PHIX_ENDPOINT_DICTIONARY,
  CLAMAV_ENDPOINT,
  PHIX_ENDPOINT_SUBMISSION,
  PHIX_ENDPOINT_SUBMISSION_TOKEN,
  PHIX_ENDPOINT_RETRIEVAL,
  PHIX_ENDPOINT_RETRIEVAL_TOKEN
}

fs.writeFile('local.json', JSON.stringify(json), function (err) {
  if (err) throw err
})
