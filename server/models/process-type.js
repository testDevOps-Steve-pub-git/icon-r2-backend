'use strict'

const CONSUMER_RABBITMQ = 'rabbitmq; consumer'

/**
 * This is a list of process types used by the server
 * @constant PROCESS_TYPE
 * @type   {list<string>}
 * @return {list<string>}   - strings containing the process type being perfomred
 * ==================================================================================================
 */
const PROCESS_TYPE = {
  ICON: 'icon',
  ICON_UI: 'icon-ui',
  FILE_UPLOAD: 'fileUpload',
  URL_PARSE: 'url;parse',
  PDF_GENERATION: 'pdf;generation',
  AUTHENTICATE: {
    GENERAL: 'authenticate',
    SESSION: 'authenticate;session',
    SUBMISSION: 'authenticate;submission'
  },
  RETRIEVAL: {
    RETRIEVAL: 'retrieval',
    AUTHENTICATE: 'retrieval;authenticate',
    PHIX: 'retrieval;PHIX',
    PARSE: 'retrieval;parse',
    ICON: 'retrieval;ICON',
    LOOKUP: 'retrieval;lookup'
  },
  SUBMISSION: {
    TASKS: 'submission; task-runner',
    ZIPPING: 'submission; zipping',
    FHIR: 'submission; fhir-validation',
    VIRUS_SCAN: 'submission; virus-scan',
    CRYPTO: 'submission; crypto'
  },
  RABBIT: {
    MQ: 'rabbitmq',
    CONSUMER: {
      DEFAULT: `${CONSUMER_RABBITMQ}`,
      AMQPLIB: `${CONSUMER_RABBITMQ}; amqplib-easy`,
      PHIX: `${CONSUMER_RABBITMQ}; phix`,
      AUDIT: `${CONSUMER_RABBITMQ}; audit`,
      PURGE: `${CONSUMER_RABBITMQ}; purge`
    },
    PUBLISHER: 'rabbitmq; publisher'
  },
  ACCESS: {
    PIN_STATUS: 'access; pin-status',
    VALIDATE_HCN: 'access; validate-hcn',
    SET_PIN: 'access; set-pin',
    HCN_STATUS: 'access; hcn-status',
    RESET_ACCESS: 'access; reset-access',
    VALIDATE_TOKEN: 'access; validate-token',
    RESET_PIN: 'access; reset=pin'
  },
  AUDIT_UPDATE: 'audit;update',
  DATA_DICT: 'data-dictionary',
  GEO_IP: 'geo-ip',
  UNKNOWN_PROCESS_TYPE: 'UNKNOWN_PROCESS_TYPE'
}

module.exports = PROCESS_TYPE
