const {readDir} = require('./operations')
const {saveToDir, serviceFromJson, serviceToJson} = require('./operations')
const merge = require('./merge')

function readFromDir(directory) {
  return readDir(directory)
    .then((services) => {
      return {services}
    })
}

module.exports = {
  readFromDir,
  merge,
  saveToDir,
  serviceFromJson,
  serviceToJson
}
