module.exports = function (RestApiSelectOnly) {
  RestApiSelectOnly.disableRemoteMethodByName('create')
  RestApiSelectOnly.disableRemoteMethodByName('upsert')
  RestApiSelectOnly.disableRemoteMethodByName('updateAll')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.updateAttributes')
  RestApiSelectOnly.disableRemoteMethodByName('replaceById')
  RestApiSelectOnly.disableRemoteMethodByName('replaceOrCreate')
  RestApiSelectOnly.disableRemoteMethodByName('upsertWithWhere')

  // RestApiSelectOnly.disableRemoteMethodByName('find') // Enable the find api only
  RestApiSelectOnly.disableRemoteMethodByName('findById')
  RestApiSelectOnly.disableRemoteMethodByName('findOne')

  RestApiSelectOnly.disableRemoteMethodByName('deleteById')

  RestApiSelectOnly.disableRemoteMethodByName('confirm')
  RestApiSelectOnly.disableRemoteMethodByName('count')
  RestApiSelectOnly.disableRemoteMethodByName('exists')
  RestApiSelectOnly.disableRemoteMethodByName('resetPassword')
  RestApiSelectOnly.disableRemoteMethodByName('createChangeStream')

  RestApiSelectOnly.disableRemoteMethodByName('prototype.__count__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__create__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__delete__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__destroyById__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__findById__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__get__accessTokens')
  RestApiSelectOnly.disableRemoteMethodByName('prototype.__updateById__accessTokens')
}
