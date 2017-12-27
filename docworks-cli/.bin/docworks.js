#!/usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

require('babel-polyfill');

var tmp = require('tmp-promise');
var extractComparePush = require('../dist/extract-compare-push').default;
var validate = require('../dist/validate').default;
var optimist = require('optimist');
var resolve = require('resolve');

if (process.argv.length < 3) {
  printUsage();
  process.exit(1);
}

var command = process.argv[2];

if (command === 'ecp') {
  ecp();
} else if (command === 'validate' || command === 'val') {
  validateCommand();
} else {
  printUsage(1);
  process.exit(1);
}

function printUsage() {
  console.log('Usage: ' + optimist.$0 + ' [command] [options...]');
  console.log('');
  console.log('Commands:');
  console.log('  ecp              extract, compare and push docs from sources to a docs git repository');
  console.log('  val | validate   validate the jsDoc annotations ');
}

function resolvePlugins(plugins) {
  return (plugins ? Array.isArray(plugins) ? plugins : [plugins] : []).map(function (pluginCmd) {
    var _pluginCmd$split = pluginCmd.split(/:(.+)/),
        _pluginCmd$split2 = _slicedToArray(_pluginCmd$split, 2),
        plugin = _pluginCmd$split2[0],
        param = _pluginCmd$split2[1];

    plugin = resolve.sync(plugin, { basedir: '.' });
    try {
      var pluginModule = require(plugin);
      if (param && pluginModule.init) pluginModule.init(param);
    } catch (err) {}
    return plugin;
  });
}

function ecp() {
  var argv = optimist.usage('Usage: $0 ecp -r [remote repo] -s [local sources] -p [file pattern]').demand('r').alias('r', 'remote').describe('r', 'remote repository to merge docs into').demand('fs').alias('fs', 'sources').describe('fs', 'folder containing the source files to extract docs from').demand('p').alias('p', 'project').describe('p', 'project folder name in the docs repo').default('fp', ".+\\.js?$").alias('fp', 'pattern').describe('fp', 'file pattern, defaults to ".+\\.js$"').alias('plug', 'jsdocplugin').describe('plug', 'a module name that is a jsdoc plugin').parse(process.argv.slice(3));

  var remote = argv.remote;
  var sources = argv.sources;
  var pattern = argv.pattern;
  var project = argv.project;
  var plugins = resolvePlugins(argv.jsdocplugin);

  tmp.dir().then(function (o) {
    return extractComparePush(remote, o.path, project, { "include": sources, "includePattern": pattern }, plugins);
  });
}

function validateCommand() {
  var argv = optimist.usage('Usage: $0 validate -fs [local sources] -p [file pattern] -fp [file pattern]').demand('fs').alias('fs', 'sources').describe('fs', 'folder containing the source files to extract docs from').default('fp', ".+\\.js?$").alias('fp', 'pattern').describe('fp', 'file pattern, defaults to ".+\\.js$"').alias('plug', 'jsdocplugin').describe('plug', 'a module name that is a jsdoc plugin').parse(process.argv.slice(3));

  var sources = argv.sources;
  var pattern = argv.pattern;
  var plugins = resolvePlugins(argv.jsdocplugin);

  if (!validate({ "include": sources, "includePattern": pattern }, plugins)) process.exit(1);
}
