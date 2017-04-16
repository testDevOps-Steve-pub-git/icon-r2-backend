'use strict'

var logger = require(`${__base}/server/services/logger-service`)
var task = require(`${__base}/server/rabbitmq/consumer/task`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const LOG_LEVELS = require(`${__base}/server/models/log-level`)

/**
 * @module message-handler
 */

module.exports = new MessageHandler()

/**
 * @function MessageHandler Handle the message which is consume from the rabbitmq
 * @return {{function} consumeMessageHandler} Return the function which consume the message from queue
 */
function MessageHandler () {
  /**
   * @function consumeMessageHandler Consume the message from the queue
   * @param {Object} message Represent the message from the queue
   * @param {Object} channel Represent the rabbitmq channel
   * @return {Promise} resolve - message was processed; reject - could not be processed
   */
  function consumeMessageHandler (message, channel) {
    logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'received message from rabbitmq', message.json)
    return task.startTask(message)
    .then(() => {
      logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'message proccessed successfully', message.json)
    })
    .catch((err) => {
      /**
       * Customizing the console error logger for amqplib-easy:4.3.0 library
       * As the library log the error using console.error,
       * we are modifying it to use our own logger
       * Also throw the error back to the library so that it can catch the error and requeue the message again
       *
       * @function console.error Custom error logger
       */
      console.error = function (msg, err) {
        msg = msg + err.message
        logger.log(LOG_LEVELS.ERROR, PROCESS_TYPE.RABBIT.CONSUMER.AMQPLIB, msg, message.json)
      }
      if (err.reQueue) {
        logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'error processing message. Requeueing it again', message.json)
        throw err
      }
    })
  }

  return {
    consumeMessageHandler: consumeMessageHandler
  }
}
