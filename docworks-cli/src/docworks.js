#!/usr/bin/env node
import 'babel-polyfill';
let tmp = require('tmp-promise');
let extractComparePush = require('../dist/extract-compare-push').default;
let validate = require('../dist/validate').default;
let optimist = require('optimist');
let resolve = require('resolve');

if (process.argv.length < 3) {
  printUsage();
  process.exit(1);
}

let command = process.argv[2];

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
    .map(pluginCmd => {
      let [plugin, param] = pluginCmd.split(/:(.+)/);
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
  let argv = optimist
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
    .describe('plug', 'a module name that is a jsdoc plugin')
    .describe('ghtoken', 'Github token - see the github token at http://www.nodegit.org/guides/cloning/gh-two-factor/')
    .parse(process.argv.slice(3));

  let remote = argv.remote;
  let sources = argv.sources;
  let pattern = argv.pattern;
  let project = argv.project;
  let ghtoken = argv.ghtoken;
  let plugins = resolvePlugins(argv.plug);

  tmp.dir().then(o => {
    return extractComparePush(remote, o.path, project, {"include": sources, "includePattern": pattern}, plugins, ghtoken);
  })
    .catch(() => {
      process.exit(1);
    });
}

function validateCommand() {
  let argv = optimist
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
