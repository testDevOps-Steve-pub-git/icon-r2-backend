'use strict'

process.env.NODE_ENV = 'test'
process.env.SERVER_TYPE = 0

var path = require('path')

// Set the directory base to the project directory path
global.__base = path.resolve(__dirname, '../')
