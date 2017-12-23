#!/usr/bin/env node
require("babel-register");
require("babel-polyfill");
var tmp = require('tmp-promise');
var extractComparePush = require('../src/extract-compare-push').default;
var validate = require('../src/validate').default;
var optimist = require('optimist');
var resolve = require('resolve');

if (process.argv.length < 3) {
  printUsage();
  process.exit(1);
}

var command = process.argv[2];

if (command === 'ecp') {
  ecp();
}
else if (command === 'validate' || command === 'val') {
  validateCommand();
}
else {
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
  return (plugins?(Array.isArray(plugins)?plugins:[plugins]):[])
    // .map(resolve.sync);
    // .map((p) => resolve.sync(p, {basedir: '.'}));
    .map(pluginCmd => {
      let [plugin, param] = pluginCmd.split(/:(.+)/);
      console.log('plugin', plugin, param?param:'');
      plugin = resolve.sync(plugin, {basedir: '.'});
      try {
        let pluginModule = require(plugin);
        if (param && pluginModule.init)
          pluginModule.init(param);
      }
      catch (err) {

      }
      return plugin;
    }
    );
}

function ecp() {
  var argv = optimist
    .usage('Usage: $0 ecp -r [remote repo] -s [local sources] -p [file pattern]')
    .demand('r')
    .alias('r', 'remote')
    .describe('r', 'remote repository to merge docs into')
    .demand('fs')
    .alias('fs', 'sources')
    .describe('fs', 'folder containing the source files to extract docs from')
    .demand('p')
    .alias('p', 'project')
    .describe('p', 'project folder name in the docs repo')
    .default('fp', ".+\\.js?$")
    .alias('fp', 'pattern')
    .describe('fp', 'file pattern, defaults to ".+\\.js$"')
    .alias('plug', 'jsdocplugin')
    .describe('plug', 'a module name that is a jsdoc plugin')
    .parse(process.argv.slice(3));

  let remote = argv.remote;
  let sources = argv.sources;
  let pattern = argv.pattern;
  let project = argv.project;
  let plugins = resolvePlugins(argv.jsdocplugin);

  tmp.dir().then(o => {
    console.log('working directory', o.path);
    return extractComparePush(remote, o.path, project, {"include": sources, "includePattern": pattern});
  });
}

function validateCommand() {
  var argv = optimist
    .usage('Usage: $0 validate -fs [local sources] -p [file pattern] -fp [file pattern]')
    .demand('fs')
    .alias('fs', 'sources')
    .describe('fs', 'folder containing the source files to extract docs from')
    .default('fp', ".+\\.js?$")
    .alias('fp', 'pattern')
    .describe('fp', 'file pattern, defaults to ".+\\.js$"')
    .alias('plug', 'jsdocplugin')
    .describe('plug', 'a module name that is a jsdoc plugin')
    .parse(process.argv.slice(3));

  let sources = argv.sources;
  let pattern = argv.pattern;
  let plugins = resolvePlugins(argv.jsdocplugin);

  if (!validate({"include": sources, "includePattern": pattern}, plugins))
    process.exit(1);
}
