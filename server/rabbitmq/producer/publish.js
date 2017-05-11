'use strict'

const rabbitConfig = require(`${__base}/config`).rabbitmq
const logger = require(`${__base}/server/services/logger-service`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)
const LOG_LEVELS = require(`${__base}/server/models/log-level`)

/**
 * @module publish
 */

module.exports = new Publish()

/**
 * @function Publish Establish the connection to rabbitmq and also publish the message to rabbitmq
 * @return {{function} publisher} Return the function used can be used to publish the message to queue
 */
function Publish () {
  const amqp = require('amqplib-easy')(rabbitConfig.url, rabbitConfig.amqpOptions)

  /**
   * @function publisher Used to publish the message to queue
   * @param {Object} jsonMessage Represent the message in JSON format to be store to rabbitmq queue
   * @throws Will throw an error if anything went wrong while adding the message to queue
   */
  function publisher (jsonMessage) {
    const config = {
      queue: rabbitConfig.queueName
    }
    amqp.sendToQueue(config, jsonMessage)
    .then(() => {
      // Success state
      logger.log(LOG_LEVELS.INFO, PROCESS_TYPE.RABBIT.PUBLISHER, 'message sent to queue', jsonMessage)
    })
    .catch((err) => {
      logger.log(LOG_LEVELS.ERROR, PROCESS_TYPE.RABBIT.PUBLISHER, err, jsonMessage)
      throw err
    })
  }

  return {
    publisher: publisher
  }
}
