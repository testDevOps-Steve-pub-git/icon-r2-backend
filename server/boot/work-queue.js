'use strict'

const config = require(`${__base}/config`)
const logger = require(`${__base}/server/logger`)
const SERVER_TYPE = require(`${__base}/server/models/server-type`)
const PROCESS_TYPES = require(`${__base}/server/models/process-type`)
let publish
let consume

/**
 * @module work-queue
 * Module starts during boot of the app
 /

/*
 * @function Starts the consumer if the 'SERVER_TYPE' environment variable value is set
 * If it is not set then the default value is used which will create 'addToQueue' function to publish the message to the rabbitmq queue
 * @param {string} app - representing the loopback object
 */
module.exports = function (app) {
  switch (config.serverType) {
    case SERVER_TYPE.NONE:
      none()
      break
    case SERVER_TYPE.PUBLISHER:
      publish = require(__base + '/server/rabbitmq/producer/publish')
      startPublisher()
      break
    case SERVER_TYPE.CONSUMER:
      consume = require(__base + '/server/rabbitmq/consumer/consume')
      startConsumer()
      break
    case SERVER_TYPE.BOTH:
    default:
      consume = require(__base + '/server/rabbitmq/consumer/consume')
      publish = require(__base + '/server/rabbitmq/producer/publish')
      startPublisher()
      startConsumer()
      break
  }

  /**
   * @function no publisher or consumer; stub add to q
   */
  function none () {
    if (!process.env.NODE_ENV === 'test') logger.debug('no publisher or consumer', { processType: PROCESS_TYPES.RABBIT.MQ })
    app.addToQueue = (message) => {
      // uncomment to see what message are going through
      // logger.debug(`no publisher to queue: ${message}`, { processType: PROCESS_TYPES.RABBIT.MQ })
    }
  }
  /**
   * @function startConsumer Starts the consumer
   */
  function startConsumer () {
    logger.debug('starting consumer', { processType: PROCESS_TYPES.RABBIT.MQ })
    consume.consumer()
  }

  /**
   * @function startPublisher Create 'addToQueue' function to publish the message to the rabbitmq queue
   */
  function startPublisher () {
    logger.debug('starting publisher', { processType: PROCESS_TYPES.RABBIT.MQ })
    /**
     * @function addToQueue Function used to publish the message to the rabbitmq queue
     * @param {Object} jsonMessage Represent the message in JSON format to be store to rabbitmq queue
     */
    app.addToQueue = function (jsonMessage) {
      publish.publisher(jsonMessage)
    }
  }
}
