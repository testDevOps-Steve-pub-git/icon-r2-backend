'use strict'

const Promise = require('bluebird')
const url = require('url')
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const errorService = require(`${__base}/server/services/error-service`)
const phuList = require(`${__base}/server/phu.json`)

/**
 * @module phu-service
 */
module.exports = new PhuService()

/**
 * @function PhuService check for valid url and return the phu object based on url
 * @return {{function} getPhuObjectFromUrl Returns the phu object}
 */
function PhuService () {
  /**
   * @function getPhuAcronymList create the phu acronym array from phu.json
   * @return {Array} List of PHU acronym
   */
  function getPhuAcronymList () {
    var phuAcronymList = []
    phuList.forEach((item) => {
      phuAcronymList.push(item.acronym)
    })
    return phuAcronymList
  }

  /**
   * @function parseUrl Parse the url
   * @param {String} uri Represent the url
   * @return {Object} Object of parse url
   */
  function parseUrl (uri) {
    // Check for http value in url
    if (uri.search(/http/i) === -1) {
      // If not there then append the http
      uri = 'http://' + uri
    }
    return url.parse(uri)
  }

  /**
   * @function getSubDomains Split the hostname from the url
   * @param {Object} uri Represent the parse url object
   * @return {Array} List of sub domains
   */
  function getSubDomains (uri) {
    return uri.hostname.toUpperCase().split('.')
  }

  /**
   * @function getPhuAcronym Check the list of valid phu from phu.json
   * @param {Array} subDomains List of sub domains
   * @return {String} Acronym of the PHU
   * @throws Will throw an error if PHU acronym not found in phu.json
   */
  function getPhuAcronym (subDomains) {
    var phuAcronymList = getPhuAcronymList()
    for (var subDomain of subDomains) {
      if (phuAcronymList.indexOf(subDomain) !== -1) {
        return subDomain
      }
    }
    throw errorService.IconCustomWarning('invalid url. No phu found', { processType: PROCESS_TYPE.URL_PARSE })
  }

  /**
   * @typedef {Object} PhuObject
   * @property {int} id Represents PHU Id
   * @property {String} name Represents the PHU full name
   * @property {String} acronym Represents the PHU acronym
   */

  /**
   * @function getPhuObject Return the Phu Object
   * @param {String} phuAcronym Represent the phu acronym
   * @return {PhuObject} PHU object representing the PHU information
   * @throws Will throw an error if PHU acronym not found in phu.json
   */
  function getPhuObject (phuAcronym) {
    for (var item of phuList) {
      if (item.acronym === phuAcronym) {
        return item
      }
    }
    throw errorService.IconCustomWarning('no phu acronym found', { processType: PROCESS_TYPE.URL_PARSE })
  }

  /**
   * @function getPhuObjectFromUrl Returns the phu object based on url
   * @param {String} uri Represent the url
   * @return {PhuObject} PHU object representing the PHU information
   * @throws Throws an error if invalid url or phu not found
   */
  function getPhuObjectFromUrl (uri) {
    return Promise
           .try(() => parseUrl(uri))
           .then(getSubDomains)
           .then(getPhuAcronym)
           .then(getPhuObject)
  }

  return {
    getPhuObjectFromUrl: getPhuObjectFromUrl
  }
}
