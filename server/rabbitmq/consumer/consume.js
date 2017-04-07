'use strict'

var rabbitConfig = require(`${__base}/config`).rabbitmq
var logger = require(`${__base}/server/services/logger-service`)
var messageHandler = require(`${__base}/server/rabbitmq/consumer/message-handler`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const LOG_LEVELS = require(`${__base}/server/models/log-level`)

/**
 * @module consume
 */

module.exports = new Consume()

/**
 * @function Consume Establish the connection to rabbitmq and also consume the message from rabbitmq
 * @return {{function} consumer} Return the function used can consume the message from queue
 */
function Consume () {
  var amqp = require('amqplib-easy')(rabbitConfig.url, rabbitConfig.amqpOptions)

  /**
   * @function consumer Used to consume the message from the queue
   */
  function consumer () {
    var config = {
      queue: rabbitConfig.queueName,
      prefetch: rabbitConfig.prefetch
    }
    try {
      amqp.consume(config, messageHandler.consumeMessageHandler)
      .then(function () {
        logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, 'consumer started to consume messages from queue', {})
      })
      .catch(function (err) {
        logger.logError(LOG_LEVELS.ERROR, PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT, err, {})
        throw err
      })
    } catch (err) {
      logger.log(LOG_LEVELS.ERROR, PROCESS_TYPE.RABBIT.MQ, err, {})
    }
  }

  return {
    consumer: consumer
  }
}
