function MetaObject (data) {
  return {
    phuName: data.phuName,
    phuAcronym: data.phuAcronym,
    sessionId: data.sessionId,
    submissionId: data.txId,
    clientip: data.clientip
  }
}

module.exports = MetaObject

