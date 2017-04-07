'use strict'

 /**
  * @constant RESPONSE_STATUS_CODE
  * @type {list<int>} - Response status code
  */
const RESPONSE_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

/**
 * @module response-status-code
 * @return {RESPONSE_STATUS_CODE} Response status code
 */
module.exports = RESPONSE_STATUS_CODE
