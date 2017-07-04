'use strict'

const logger = require(`${__base}/server/logger`)
const task = require(`${__base}/server/rabbitmq/consumer/task`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

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
    logger.info(`received message from rabbitmq`, Object.assign(message.json, { processType: PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT }))
    return task.startTask(message)
    .then(() => {
      logger.info(`message proccessed successfully`, Object.assign(message.json, { processType: PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT }))
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
        logger.error(msg, Object.assign(message.json, { processType: PROCESS_TYPE.RABBIT.CONSUMER.AMQPLIB }))
      }
      if (err.reQueue) {
        logger.info('error processing message. Requeueing it again', Object.assign(message.json, { processType: PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT }))
        throw err
      }
    })
  }

  return {
    consumeMessageHandler: consumeMessageHandler
  }
}
