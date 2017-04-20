'use strict'

const SERVER_TYPE = require(__base + '/server/models/server-type')
const cfenv = require('cfenv')
const appEnv = cfenv.getAppEnv()
const nconf = require('nconf')
  .env('__')
  .file(`${__base}/local.json`)


function getService (serviceName) {
  let uri
  if (appEnv.isLocal) {
    uri = nconf.get(serviceName)
  } else {
    let serviceDetails = appEnv.getService(serviceName)
    if (serviceDetails) {
      uri = serviceDetails['credentials']['uri']
    }
  }
  if (!uri) {
    console.log(`getService for ${serviceName} failed. Is it configured in Bluemix or defined in local.json`)
  }
  return uri
}

module.exports = {
  fhirValidator: {
    enabled: true // validate fhir message vs. the json schema
  },
  token: {
    'secretKey': nconf.get('JWT_TOKEN_SECRET_KEY'),
    'expiresIn': {
      'session': process.env.JWT_SESSION_TOKEN_EXPIRES_IN || 60 * 90,       // Allowed time until session token expires. Currently 60 minutes
      'submission': process.env.JWT_SUBMISSION_TOKEN_EXPIRES_IN || 60 * 90, // Allowed time until submission token expires. Currently 60 minutes
      'inactivity': process.env.JWT_INACTIVITY_TIMEOUT || 10 * 60,          // Allowed amount of time before inactivity timeout. Currently 20 minutes
      'responseTime': process.env.USER_RESPONSE_TIMEOUT || 5 * 60           // Amount of time allowed for user to response to inactivity message. Currently 5 minutes
    },
    'maximumRefreshDuration': 20 * 60 * 60                                  // Total allowance to regenerate the token. Currently It's 20 Hours
  },
  attachment: {
    // Delete this key to allow any attachment type.
    // Empty array blocks all attachment types
    types: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'application/pdf',
      'image/png',
      'application/rtf'
    ],
    // delete this key or set it to 0 to remove attachment size limit
    size: process.env.MAX_INDIVIDUAL_FILE_SIZE || 5 * 1024 * 1024, // 5 MB

    // delete this key or set it to 0 to remove attachment limit
    limit: process.env.MAX_UPLOAD_FILES_LIMIT || 2 // max file that can be uploaded by single client
  },

  // Type of server to start.
  // Valid options are 1,2,3 where 3 being the default value
  // 0: No publisher or consumer
  // 1: Start the publisher only
  // 2: Start the consumer only
  // 3: Start both publisher and consumer
  // Any other option will be consider as 3
  serverType: process.env.SERVER_TYPE || SERVER_TYPE.BOTH,

  crypto: {
    enabled: true, // setting this to false will disable encrpyting of data stored in the database - be careful!
    // Never change the crypto password once it is in production or else previous encrypted information won't be able to decryt
    password: nconf.get('CRYPTO_PASSWORD'),
    algorithm: 'aes-256-cbc'
  },
  isProduction: process.env.NODE_SERVER_PRODUCTION_MODE || false, // Change the value to true if the app is in production
  rabbitmq: {
    url: process.env.RABBITMQ_ENDPOINT || getService('icon-rabbitmq'),
    amqpOptions: {
      heartbeat: 60,
      'rejectUnauthorized': false
    },
    queueName: 'icon',
    prefetch: 5 // Consumer prefetch
  },
  postgres: {
    writer: process.env.POSTGRES_URI_WRITER || getService('icon-postgresql'),
    lookUp: {
      maxRow: 10,
      batchThreshold: 50,
      immunizationLimit: 200
    },
    readOnlyRole: nconf.get('POSTGRES_READONLY_ROLE') // [user]:[password] - will replace the user/pwd in the postgres.writer url
  },
  dataDictionary: {
    enabled: true, // setting this false will disable updating data-dictionary items
    schedule: {
      // e.g. 2 will run every 2 months
      frequencyInMonths: process.env.DATADICT_UPDATE_MONTH_FREQUENCY || 2, // run every x months
      // e.g. 1st day of the month at 1:01am
      day: process.env.DATADICT_UPDATE_DAY_OF_MONTH || 1, // day of the month to run (1-31)
      hour: process.env.DATADICT_UPDATE_HOUR || 1, // hour to run  (0-23)
      minute: process.env.DATADICT_UPDATE_MINUTE || 1 // minute to run at (0-59)
    },
    dhir: {
      uri: nconf.get('PHIX_ENDPOINT_DICTIONARY')
    },
    domains: [
      {
        dictionary: 'schools',
        table: 'load_schools_daycares'
      },
      {
        dictionary: 'lotnumbers',
        table: 'load_lots'
      }
    ]
  },
  clamav: {
    enabled: true, // setting this to false will disable virus scanning of uploaded files - be careful!
    endPoint: nconf.get('CLAMAV_ENDPOINT'), // IP of bluemix clamav container
    port: process.env.CLAMAV_PORT || 3310,
    timeout: process.env.CLAMAV_TIMEOUT || 10000 // 10s before considering it a failed attempt
  },
  phixEndpoint: {
    submission: {
      url: nconf.get('PHIX_ENDPOINT_SUBMISSION'), // Submission Endpoint for phix server
      token: nconf.get('PHIX_ENDPOINT_SUBMISSION_TOKEN') // Token for PHIX Submission Endpoint
    },
    retrieval: {
      url: nconf.get('PHIX_ENDPOINT_RETRIEVAL'), // Retrieval Endpoint for phix server
      token: nconf.get('PHIX_ENDPOINT_RETRIEVAL_TOKEN') // Token for PHIX Retrieval Endpoint
    },
    repostCodes: [400, 406, 409, 412, 422]
  },
  elasticSearch: {
    url: process.env.ELASTIC_SEARCH_ENDPOINT || getService('icon-elasticsearch')
  },
  phixEndpointCerts: undefined,
    // Timeout for work queue connection problems
  workQueueTimeout: process.env.WORK_QUEUE_TIMEOUT || 30000,
  geoip: {
    databaseUpdate: {
      // Day and time at which update will run automatically
      // Default is set to 7th of every month at 12:00 AM
      dayOfMonth: process.env.GEOIP_UPDATE_DAY_OF_MONTH || 7,
      hour: process.env.GEOIP_UPDATE_HOUR || 0,
      minute: process.env.GEOIP_UPDATE_MINUTE || 0
    }
  },
  pdfFonts: ['Roboto', 'OpenSans'],
  tracking: {
    startSessionPage: '/welcome',
    endSessionPage: 'confirmation',
    authWorkflowUri: 'auth',
    anonWorkflowUri: 'anon',
    updateTimeService: {
      enabled: true,  // setting this to false will disable the service that updates session componenet timing in Elasticsearch
      delay: 10000,
      typeToUpdate: 'log'
    }
  }
}
