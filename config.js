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
    size: process.env.MAX_INDIVIDUAL_FILE_SIZE || 5 * 1024 * 1024 // 5 MB

    // Total # of files that can be upload is controlled in the database - there
    // is a trigger on the Submission_Attachment table that limits the number of
    // files any one user session can upload.
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
    // If you change this value, make sure the database is empty first or you wont be able to decrypt inflight data
    password: nconf.get('CRYPTO_PASSWORD'),
    algorithm: 'aes-256-cbc',
    fileEncoding: 'base64'
  },
  isProduction: process.env.NODE_SERVER_PRODUCTION_MODE || false, // Change the value to true if the app is in production
  isTest: process.env.NODE_ENV === 'test',
  rabbitmq: {
    url: process.env.RABBITMQ_ENDPOINT || getService('icon-rabbitmq'),
    amqpOptions: {
      heartbeat: 60,
      'rejectUnauthorized': false
    },
    queueName: 'icon',
    exchange: 'amqp.icon',
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
      // feeds into cron for scheduling dictionary updates - use '*' to run every period
      month: process.env.DATADICT_UPDATE_MONTH || '*/2',    // run every 2nd month
      day: process.env.DATADICT_UPDATE_DAY_OF_MONTH || '1', // day of the month to run (1-31)
      hour: process.env.DATADICT_UPDATE_HOUR || '1',        // hour to run  (0-23)
      minute: process.env.DATADICT_UPDATE_MINUTE || '1'     // minute to run at (0-59)
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
    endPoint: nconf.get('CLAMAV_ENDPOINT')
  },
  phixEndpoint: {
    submission: {
      url: nconf.get('PHIX_ENDPOINT_SUBMISSION'), // Submission Endpoint for phix server
      token: nconf.get('PHIX_ENDPOINT_SUBMISSION_TOKEN') // Token for PHIX Submission Endpoint
    },
    retrieval: {
      url: nconf.get('PHIX_ENDPOINT_RETRIEVAL'), // Retrieval Endpoint for phix server
      token: nconf.get('PHIX_ENDPOINT_RETRIEVAL_TOKEN'), // Token for PHIX Retrieval Endpoint
      queryString: (oiid) => {
        return `?patient.identifier=http://ca-on-panorama-immunization-id|${oiid}&_include=Immunization:patient&_include=Immunization:performer&_include:recurse=Practitioner:organization&_revinclude:recurse=ImmunizationRecommendation:patient&_format=application/json`
      }
    },
    repostCodes: [400, 406, 409, 412, 422]
  },
  access: {
    url: nconf.get('DHIR_ENDPOINT_ACCESS'),
    token: nconf.get('DHIR_ENDPOINT_ACCESS_TOKEN'),
    queryString: (oiid) => `?Patient.identifier=http://ca-on-panorama-immunization-id|${oiid}`,
    endPoints: {
      pinStatus: '$ClientStatus',
      validateHcn: '$ValidateHCN',
      setPin: '$SetPIN',
      resetAccess: '$ResetAccess',
      validateToken: '$ValidateToken',
      resetPin: '$ResetPIN'
    }
  },
  elasticSearch: {
    url: process.env.ELASTIC_SEARCH_ENDPOINT || getService('icon-elasticsearch')
  },
  phixEndpointCerts: undefined,
    // Timeout for work queue connection problems
  workQueueTimeout: process.env.WORK_QUEUE_TIMEOUT || 30000,
  geoip: {
    enable: false,
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
      enabled: false,  // setting this to false will disable the service that updates session componenet timing in Elasticsearch
      delay: 10000,
      typeToUpdate: 'log'
    }
  }
}
