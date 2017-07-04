'use strict'

const rabbitConfig = require(`${__base}/config`).rabbitmq
const logger = require(`${__base}/server/logger`)
const messageHandler = require(`${__base}/server/rabbitmq/consumer/message-handler`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

/**
 * @module consume
 */

module.exports = new Consume()

/**
 * @function Consume Establish the connection to rabbitmq and also consume the message from rabbitmq
 * @return {{function} consumer} Return the function used can consume the message from queue
 */
function Consume () {
  const amqp = require('amqplib-easy')(rabbitConfig.url, rabbitConfig.amqpOptions)

  /**
   * @function consumer Used to consume the message from the queue
   */
  function consumer () {
    const config = {
      exchange: rabbitConfig.exchange,
      queue: rabbitConfig.queueName,
      prefetch: rabbitConfig.prefetch
    }
    try {
      amqp.consume(config, messageHandler.consumeMessageHandler)
      .then(function () {
        logger.info('consumer started to consume messages from queue', { processType: PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT })
      })
      .catch(function (err) {
        logger.error(err.message, Object.assign(err, {
          processType: PROCESS_TYPE.RABBIT.CONSUMER.DEFAULT
        }))
        throw err
      })
    } catch (err) {
      logger.error(err.message, Object.assign(err, {
        processType: PROCESS_TYPE.RABBIT.MQ
      }))
    }
  }

  return {
    consumer: consumer
  }
}
