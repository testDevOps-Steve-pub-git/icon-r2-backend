'use strict'

var stream = require('stream')
var util = require('util')

var Writable = stream.Writable
var memoryStore = { }

module.exports = WritableMemoryStream

/* Writable memory stream */
function WritableMemoryStream (key, options) {
  // allow use without new operator
  if (!(this instanceof WritableMemoryStream)) {
    return new WritableMemoryStream(key, options)
  }
  Writable.call(this, options) // init super
  this.key = key // save key
  memoryStore[key] = new Buffer('') // empty
}
util.inherits(WritableMemoryStream, Writable)

WritableMemoryStream.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  var buffer = (Buffer.isBuffer(chunk))
    ? chunk  // already is Buffer use it
    : new Buffer(chunk, enc)  // string, convert

  // concat to the buffer already there
  memoryStore[this.key] = Buffer.concat([memoryStore[this.key], buffer])
  cb()
}

// Return the memoryStore object
WritableMemoryStream.prototype.getStreamData = () => memoryStore
