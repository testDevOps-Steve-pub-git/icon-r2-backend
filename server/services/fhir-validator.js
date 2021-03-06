'use strict'

const jsen = require('jsen')
const logger = require(`${__base}/server/logger`)
const errorHandler = require(`${__base}/server/services/error-service`)
const config = require(`${__base}/config.js`).fhirValidator

// This constant is internally recognized by the JSEN validator
const JSON_SCHEMA_DRAFT_4 = 'http://json-schema.org/draft-04/schema#'

// Path to ICON FHIR profile schema file
const ICON_PROFILE_PATH = `${__base}/server/services/fhir-validator/schemas/communication.schema.json`

// Common FHIR validation patterns
const REGEX_HUMAN_NAME = /^[0-9a-zàâçéèêëîïôûùüÿñæœ !.'-]*$/i
const REGEX_TITLE_NAME = /^[0-9a-zàâçéèêëîïôûùüÿñæœ ()@&!'’.,-\\/#?]*$/i

// Singleton: ICON FHIR profile schema
let _iconProfile = null

/** *** Private functions *****/

/**
 * Lazily initialize the JSON validator.
 * It validates the ICON FHIR profile schema which is used to validate incoming FHIR requests.
 */
function initialize () {
  // Ensure singleton is initialized
  if (_iconProfile == null) {
    if (!validateIconProfile(ICON_PROFILE_PATH)) {
      _iconProfile = null
      return false
    }
    logger.info(Object.assign({
      processType: 'fhirValidator;initialize',
      message: 'ICON FHIR validator initialized'
    }))
  }
  return true
}

/**
 * Validate the ICON FHIR profile schema meets the standard JSON schema specification.
 *
 * @param {String} path location of the ICON profile file
 * @return {bool, errors} true if data is valid, otherwise false
 */
function validateIconProfile (path) {
  // Validate the ICON FHIR profile schema against JSON schema draft-04
  let draftSchema = {'$ref': JSON_SCHEMA_DRAFT_4}
  let isValid = false
  let draftValidator = null
  try {
    // Load ICON profile schema
    _iconProfile = require(path)

    // Validate ICON profile against JSON schema standard
    draftValidator = jsen(draftSchema)
    isValid = draftValidator(_iconProfile, { greedy: false })

    // Report validation errors
    if (!isValid && draftValidator.errors) {
      logger.error(Object.assign({
        processType: 'fhirValidator;validateIconProfile',
        message: 'ICON FHIR profile schema errors' + JSON.stringify(draftValidator.errors)
      }))
    }
  } catch (e) {
    logger.error(Object.assign({
      processType: 'fhirValidator;validateIconProfile',
      message: 'ICON FHIR profile schema is not valid - ' + e.message
    }))
  }
  return isValid
}

/**
 * Validate the specified ICON FHIR object and return error report.
 *
 * @param {Object} jsonObj ICON FHIR JSON object
 * @param {string} submissionId matching submission ID
 * @return {bool} true if data is valid, otherwise false
 */
function validateFhirData (jsonObj, submissionId) {
  // Ensure validator is initialized
  if (!initialize()) {
    throw errorHandler.IconCustomError('ICON FHIR profile is not valid', {
      processType: 'fhirValidator;validateIconProfile',
      logged: true
    })
  }

  let iconValidator = null
  let isValid = false
  let errors = []
  try {
    // Validate FHIR resource matches submissionId
    let validateSubmissionId = function (value, childSchema) {
      return value === submissionId
    }

    // Verify FHIR object against ICON profile
    iconValidator = jsen(_iconProfile,
      {
        greedy: false,
        formats: {
          REGEX_HUMAN_NAME: REGEX_HUMAN_NAME,
          REGEX_TITLE_NAME: REGEX_TITLE_NAME,
          validateSubmissionId: validateSubmissionId
        }
      })
    isValid = iconValidator(jsonObj)
    errors = iconValidator.errors
  } catch (e) {
    throw errorHandler.IconCustomError(`Error validating FHIR object - ${e.message}`, {
      processType: 'fhirValidator;validateFhirData'
    })
  }

  // Report FHIR validation
  return {
    isValid: isValid,
    errors: errors
  }
}

/** *** Public functions *****/

/**
 * Validate the specified ICON FHIR object and return error report.
 *
 * @param {Object} jsonObj ICON FHIR JSON object
 * @param {string} submissionId matching submission ID
 * @return {bool} true if data is valid, otherwise false
 */
exports.validate = function (jsonObj, submissionId) {
  if (config.enabled) {
    return validateFhirData(jsonObj, submissionId)
  } else {
    return {
      isValid: true,
      errors: []
    }
  }
}
