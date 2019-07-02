// eslint-disable-next-line no-unused-vars
let logger = console
const {copy, ensureDir} = require('fs-extra')

const setMediaDir = function(value) {
  // jsdoc with requizzle loads the modules twice - so the only way to move config between the two runs is using global
  global.wixJsDocPluginMediaDir = value
}

const setLogger = function(value) {
  logger = value
}

const init = function(param) {
  setMediaDir(param)
}

async function ecpAfterMerge(workingDir) {
  await ensureDir(`${workingDir}/media`)
  return copy(global.wixJsDocPluginMediaDir, `${workingDir}/media`)
}

module.exports = {
  ecpAfterMerge,
  init,
  setLogger,
  setMediaDir
}
