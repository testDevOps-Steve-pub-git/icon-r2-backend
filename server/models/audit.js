'use strict'

module.exports = class Audit {
  constructor (initialProcessType, initialResponseStatusCode) {
    this._timestamp = new Date()
    this._processType = initialProcessType
    this._responseStatusCode = initialResponseStatusCode
    this._clientip = null
    this._phuName = null
    this._phuAcronym = null
    this._sessionId = null
    this._submissionId = null
    this._message = null
    this._browserName = null
    this._os = null
    this._device = null
    this._location = null
    this._isMobile = null
    this._setLanguage = null
    this._referer = null
    this._fileCount = null
    this._isAuth = null
  }

  toList () {
    return {
      timestamp: this._timestamp,
      message: this._message,
      processType: this._processType,
      responseStatusCode: this._responseStatusCode,
      clientip: this._clientip,
      phuName: this._phuName,
      phuAcronym: this._phuAcronym,
      sessionId: this._sessionId,
      submissionId: this._submissionId,
      browserName: this._browserName,
      os: this._os,
      device: this._device,
      location: this._location,
      isMobile: this._isMobile,
      setLanguage: this._setLanguage,
      referer: this._referer,
      fileCount: this._fileCount,
      isAuth: this._isAuth
    }
  }

  get timestamp () {
    return this._timestamp
  }

  get processType () {
    return this._processType
  }

  get responseStatusCode () {
    return this._responseStatusCode
  }

  get clientip () {
    return this._clientip
  }

  set clientip (value) {
    this._clientip = value
  }

  get phuName () {
    return this._phuName
  }

  set phuName (value) {
    this._phuName = value
  }

  get phuAcronym () {
    return this._phuAcronym
  }

  set phuAcronym (value) {
    this._phuAcronym = value
  }

  get sessionId () {
    return this._sessionId
  }

  set sessionId (value) {
    this._sessionId = value
  }

  get submissionId () {
    return this._submissionId
  }

  set submissionId (value) {
    this._submissionId = value
  }

  get message () {
    return this._message
  }

  set message (value) {
    this._message = value
  }

  get browserName () {
    return this._browserName
  }

  set browserName (value) {
    this._browserName = value
  }

  get os () {
    return this._os
  }

  set os (value) {
    this._os = value
  }

  get device () {
    return this._device
  }

  set device (value) {
    this._device = value
  }

  get location () {
    return this._location
  }

  set location (value) {
    this._location = value
  }

  get isMobile () {
    return this._isMobile
  }

  set isMobile (value) {
    this._isMobile = value
  }

  get setLanguage () {
    return this._setLanguage
  }

  set setLanguage (value) {
    this._setLanguage = value
  }

  get referer () {
    return this._referer
  }

  set referer (value) {
    this._referer = value
  }

  get fileCount () {
    return this._fileCount
  }

  set fileCount (value) {
    this._fileCount = value
  }

  get isAuth () {
    return this._isAuth
  }

  set isAuth (value) {
    this._isAuth = value
  }
}
