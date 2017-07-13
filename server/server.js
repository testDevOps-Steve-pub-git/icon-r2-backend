const loopback = require('loopback')
const boot = require('loopback-boot')
const path = require('path')
const diehard = require('diehard')
const cfenv = require('cfenv')

/**
 * Set the directory base to the project directory path
 */
global.__base = path.resolve(__dirname, '../')

const config = require(`${__base}/config`) // get our config file
const logger = require(`${__base}/server/logger`)
const router = require(`${__base}/server/router`)()
const appEnv = cfenv.getAppEnv()

const app = module.exports = loopback()

/**
 * Set the data that will be used in datasource.json file
 */

// Set the read-only connector to the database for use by lookups
function readOnlyRole () {
  try {
    const reader = config.postgres.writer.replace(/(postgres:\/\/)(.*)@(.*)/, `$1${config.postgres.readOnlyRole}@$3`)
    return reader
  } catch (err) {
    logger.error({
      processType: 'server',
      message: 'Could not set read-only connection. Defaulting to write role. ' + err.message
    })
    return config.postgres.writer
  }
}
app.set('postgresWriter', config.postgres.writer)
app.set('postgresReader', readOnlyRole())

/**
 * Immunization record submission
 */
app.post('/api/ImmunizationSubmissions', router.api.postImmunizationSubmission)

/**
 * supporting file upload
 */
app.post('/api/SubmissionAttachments', router.api.submissionAttachment)

/**
 * submission token
 */
app.get('/api/token/submission', router.api.authenticateSessionToken)
app.get('/api/token/refresh/session', router.api.authenticateSessionToken)
app.get('/api/token/refresh/submission', router.api.authenticateSessionAndSubmissionToken)

/**
 * Tracking API
 */
app.post('/api/tracking', router.api.tracking)

/**
 * PDF Generation API
 */
app.post('/api/pdf', router.api.pdfGeneration)

/**
 * lookup like address, city, school and daycare
 */
app.get('/api/lookup/*', router.api.lookup)

/**
 * Forwards the yellowCard request to PHIX endpoint and returns the response
 */
app.get('/api/immunizationRetrieval', router.api.immunizationRetrieval)

/**
 * Access and PIN tool
 */
app.get('/api/access/pin-status', router.api.access.pinStatus)
app.post('/api/access/validate-hcn', router.api.access.validateHCN)
app.post('/api/access/validate-token', router.api.access.validateToken)
app.post('/api/access/set-pin', router.api.access.setPin)
app.post('/api/access/reset-pin', router.api.access.resetPin)
app.post('/api/access/reset', router.api.access.reset)

app.get('/', (req, res, next) => {
  res.status(404)
  res.end()
})

/**
 * Server main entrypoint
 */
app.start = function () {
    // start the web server
  return app.listen(appEnv.port, appEnv.bind, function () {
    app.emit('started')
    const baseUrl = app.get('url').replace(/\/$/, '')
    logger.info({
      processType: 'server',
      message: 'web server listening at ' + baseUrl
    })
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath
      logger.info({
        processType: 'server',
        message: 'browse REST API at ' + baseUrl + explorerPath
      })
    }
    // diehard is used for cleaning up connections before the process exits. To ensure connections are cleaned up
    diehard.listen()
  }).on('error', function (error) {
    logger.error({
      processType: 'server',
      message: 'server start error: ' + error.message
    })
    process.exit(1)
  })
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err

    // start the server if `$ node server.services`
  if (require.main === module) {
    try {
      app.start()

      process.on('uncaughtException', function (error) {
        logger.error({
          processType: 'server',
          message: 'uncaughtException error: ' + error.message
        })
        process.exit(1)
      })
    } catch (error) {
      logger.error({
        processType: 'server',
        message: 'boot error: ' + error.message
      })
      process.exit(1)
    }
  }
})
