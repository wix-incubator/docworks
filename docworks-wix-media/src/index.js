
let path = require('path');
let fs = require('fs');
let logger = console;
import {copy, ensureDir} from 'fs-extra';

exports.setMediaDir = function(value) {
  // jsdoc with requizzle loads the modules twice - so the only way to move config between the two runs is using global
  global.wixJsDocPluginMediaDir = value;
};

exports.setLogger = function(value) {
  logger = value;
};

exports.init = function(param) {
  exports.setMediaDir(param);
};

export async function ecpAfterMerge(workingDir, projectSubdir) {
  await ensureDir(`${workingDir}/media`);
  return copy(global.wixJsDocPluginMediaDir, `${workingDir}/media`);
}