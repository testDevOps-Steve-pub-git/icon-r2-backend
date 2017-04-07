'use strict'

 /**
 * This is a list of messages to be used in reference to the logging operations to the server.
 * @desc     these messages will be used by the logging object to indicate the process being performed by the server
 * @constant RETRIEVAL_MESSAGES
 * @type     {list<string>}
 * @return   {list<string>}     - List containing messages to be used in the retrieval proceess of a yellowcard request
 * =================================================================================================================================
 */
const RETRIEVAL_MESSAGES = {
  AUTHENTICATE: {
    ERROR: {
      START: 'WARNING: Certain Parameters were not passed:',
      OIID: 'OIID',
      PIN: 'PIN',
      RELATIONSHIP: 'RELATIONSHIP',
      NOT_INCLUDED: ' were not included in the request',
      NO_CONDITIONS: 'set of conditions were not passed in. Could not validate the error (regarding oiid, pin, and relationship)'
    },
    SUCCESS: 'The Headers were set Correctly: Valid oiid, pin, and relationship were provided'
  },
  PHIX: {
    SUCCESS: 'FHIR Message was returned from PHIX',
    ERRORS: {
      RESPONSE_NOT_PARSED: 'Response not parsed. Response not expected value'
    }
  },
  PARSE: {
    ERRORS: {
      NO_BUNDLE: 'FHIR Message was not a Bundle --> Unknown message format ... Not FHIR ... was recieved and could not be parsed',
      INVALID_OIID: 'Message was parsed from FHIR Message to JSON Message, message stated INVALID OIID',
      UNKNOWN_ERROR: 'Message was parsed from FHIR Message to JSON Message, message contained unknown errors',
      NO_MESSAGE_RETURNED: 'Message was parsed from FHIR Message to JSON Message, but no message was returned'
    }
  }
}

module.exports = RETRIEVAL_MESSAGES
