'use strict'

var ycModels = require(`${__base}/server/models/yellowcard/models`)     // --> Models for messages, status codes, etc...

/**
 * YellowCardService.authenticate.create: Session() Method
 *
 * @desc   This function will create session object with the following properties:
 *            1) token:               (Session Token for retrieving a yellowcard)
 *            2) metaData:            (Object for storing meta data about the client requesting the yellowcard)
 *               |__ phuName:         (Long form of the PHU who the client is requesting the yellowcard from)
 *               |__ phuAcronym:      (Short form of the PHU who the client is requesting the yellowcard from)
 *               |__ sessionId:       (Sessionid of the client who is requesting the yellowcard)
 *               |__ clientIP:        (IP address of the user/client requesting the yellowcard)
 *            3) client:              (Object for storing information about the client requesting/on the yellowcard)
 *               |__ oiid:            (Ontario Immunization Identifier)
 *               |__ pin:             (Pin which co-insides with the Oiid above)
 *               |__ relationship:    (Relationship to the patient on the Yellowcard)
 *               |__ language:        (language culture of the client)
 *
 * @param {models.yellowcard.authenticate.session}  - Session Object
 */
function createSession (sessionId, clientIp, token, phuName, phuAcronym, oiid, pin, relationship, language) {
  return (new ycModels.AUTHENTICATE.Session(sessionId, clientIp, token, phuName, phuAcronym, oiid, pin, relationship, language))
}

/**
 * YellowCardService.authenticate.create: errorMessage() Method
 *
 * @desc   This function will create an error message using the conditions
 *         passed in as the parameters.
 *
 *         This function will check if the conditions were actually passed
 *         in with the following attributes {hasOiid, hasPin, hasRelationship}.
 *
 *         State: True  --> Proper error message is returned
 *         State: False --> Message stating improper conditions passed
 *
 * @param {list<bool>}  conditions  - list of error conditions (boolean evaluations)
 */
function createErrorMessage (conditions) {
  var message = ycModels.MESSAGES.AUTHENTICATE.ERROR.START + ' {'
  var count = 0
  var hasConditions = !!conditions &&
                      !!conditions.hasOiid &&
                      !!conditions.hasPin &&
                      !!conditions.hasRelationship

  if (hasConditions) {
    if (!conditions.hasOiid) {
      message += ycModels.MESSAGES.AUTHENTICATE.ERROR.OIID
      count++
    }

    if (!conditions.hasPin) {
      if (count++ > 0) message += ', '
      message += ycModels.MESSAGES.AUTHENTICATE.ERROR.PIN
      count++
    }

    if (!conditions.hasRelationship) {
      if (count++ > 0) message += ', '
      message += ycModels.MESSAGES.AUTHENTICATE.ERROR.RELATIONSHIP
    }

    message += ' }'
  } else {
    message += ycModels.MESSAGES.AUTHENTICATE.ERROR.NO_CONDITIONS
  }

  return message
}

/**
 * YellowCardService: AuthenticateService() Method
 *
 * @desc   This function will wrapper the createErrorMessage() Method above
 *
 *         The function will return a list as follows:
 *            Object:
 *            |_ create:
 *               |__ session        --> for creating a session object
 *               |__ errorMessage   --> for creating an error object on failure
 *
 * @param {list<functions>}    - list containing createErrorMessage Function
 */
function AuthenticateService () {
  return ({
    create: {
      session: createSession,
      errorMessage: createErrorMessage
    }
  })
}

module.exports = AuthenticateService()
