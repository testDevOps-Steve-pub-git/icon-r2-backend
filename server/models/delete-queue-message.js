module.exports = function (DeleteQueueMessage) {
  DeleteQueueMessage.disableRemoteMethodByName('create')
  DeleteQueueMessage.disableRemoteMethodByName('upsert')
  DeleteQueueMessage.disableRemoteMethodByName('updateAll')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.updateAttributes')
  DeleteQueueMessage.disableRemoteMethodByName('replaceById')
  DeleteQueueMessage.disableRemoteMethodByName('replaceOrCreate')
  DeleteQueueMessage.disableRemoteMethodByName('upsertWithWhere')

  DeleteQueueMessage.disableRemoteMethodByName('find')
  DeleteQueueMessage.disableRemoteMethodByName('findById')
  DeleteQueueMessage.disableRemoteMethodByName('findOne')

  DeleteQueueMessage.disableRemoteMethodByName('deleteById')

  DeleteQueueMessage.disableRemoteMethodByName('confirm')
  DeleteQueueMessage.disableRemoteMethodByName('count')
  DeleteQueueMessage.disableRemoteMethodByName('exists')
  DeleteQueueMessage.disableRemoteMethodByName('createChangeStream')

  DeleteQueueMessage.disableRemoteMethodByName('prototype.__count__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__create__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__delete__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__destroyById__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__findById__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__get__accessTokens')
  DeleteQueueMessage.disableRemoteMethodByName('prototype.__updateById__accessTokens')

    // API to delete message from rabbit queue
  DeleteQueueMessage.deleteMessageFromQueue = function (req, cb) {
    const logger = require(`${__base}/server/logger`)
    try {
      if (req.body.documentId && req.body.submissionId) {
        var msg = {
          phuName: req.body.phuName,
          phuAcronym: req.body.phuAcronym,
          sessionId: req.body.sessionId,
          submissionId: req.body.submissionId,
          clientip: req.body.clientip,
          documentId: req.body.documentId
        }
        DeleteQueueMessage.app.deleteMessageFromQueue(JSON.stringify(msg))
        cb(null, 'Accepted')
      } else {
        logger.log('warn', Object.assign({
          processType: 'queue',
          message: 'delete request to remove message from Queue failed: documentId or submissionId not found'
        }))
        cb(null, 'Invalid request')
      }
    } catch (error) {
      logger.log('warn', Object.assign({
        processType: 'queue',
        message: 'delete request to remove message from Queue failed: ' + error.message
      }))
      cb(null, 'Invalid request')
    }
  }

  DeleteQueueMessage.remoteMethod('deleteMessageFromQueue', {
    http: {
      path: '/',
      verb: 'post'
    },
    accepts: {
      arg: 'req',
      type: 'object',
      'http': {
        source: 'req'
      }
    },
    returns: {
      arg: 'message',
      type: 'string'
    }
  })
}
