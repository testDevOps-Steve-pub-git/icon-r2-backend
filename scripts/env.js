var fs = require('fs')
var exec = require('child_process').exec

let store = {}

var parseService = (serviceName, credentialsName) => {
  return new Promise((resolve, reject) => {
    exec('cf curl -X GET /v2/service_keys/$(cf service-key ' + serviceName + ' ' + credentialsName + ' --guid)', (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        let uri = JSON.parse(stdout)['entity']['credentials']['uri']
        store[serviceName] = uri
        resolve(store)
      }
    })
  })
}

var parseUserProvidedService = (serviceName) => {
  return new Promise((resolve, reject) => {
    exec('cf curl -X GET /v2/user_provided_service_instances/$(cf service ' + serviceName + ' --guid)', (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        let creds = JSON.parse(stdout)['entity']['credentials']
        for (var key in creds) {
          store[key] = creds[key]
        }
        resolve(store)
      }
    })
  })
}

let es = parseService('icon-elasticsearch', 'Credential1')
let pgl = parseService('icon-postgresql', 'Credential1')
let rmq = parseService('icon-rabbitmq', 'Credential1')
let ups = parseUserProvidedService('env_setup')

Promise.all([es, pgl, rmq, ups]).then(result => {
  for (var arg of process.argv){
    if (arg.indexOf('=') > 0){
      let keyValPairs = arg.split('=')
       if(result[3][keyValPairs[0]]!=undefined){
         result[3][keyValPairs[0]] = keyValPairs[1]
       }
    }
  }
  fs.writeFile('local.json', JSON.stringify(result[3]), (err) => {
    if (err) throw err
  })
})
