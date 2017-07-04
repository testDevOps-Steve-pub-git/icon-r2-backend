'use strict'

const rabbitConfig = require(`${__base}/config`).rabbitmq
const logger = require(`${__base}/server/logger`)
const PROCESS_TYPE = require(`${__base}/server/models/process-type`)

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
      queue: rabbitConfig.queueName,
      exchange: rabbitConfig.exchange
    }
    amqp.sendToQueue(config, jsonMessage)
    .then(() => {
      // Success state
      logger.info('message sent to queue', Object.assign(jsonMessage, {
        processType: PROCESS_TYPE.RABBIT.PUBLISHER
      }))
    })
    .catch((err) => {
      logger.error(err.message, Object.assign(err, {
        processType: PROCESS_TYPE.RABBIT.PUBLISHER,
        jsonMessage: jsonMessage
      }))
      throw err
    })
  }

  return {
    publisher: publisher
  }
}
