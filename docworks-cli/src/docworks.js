#!/usr/bin/env node
import 'babel-polyfill';
let tmp = require('tmp-promise');
let extractComparePush = require('../dist/extract-compare-push').default;
let validate = require('../dist/validate').default;
let optimist = require('optimist');
let resolve = require('resolve');
import runTern from '../dist/run-tern';

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
else if (command === 'tern') {
  tern();
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
  console.log('  val | validate   validate the jsDoc annotations');
  console.log('  tern             generate tern file from docworks repo');
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
    .usage('Usage: $0 ecp -r [remote repo] [-b [remote branch]] -s [local sources] -p [file pattern] [--plug [plugin]] [--dryrun]')
    .demand(  'r')
    .alias(   'r', 'remote')
    .describe('r', 'remote repository to merge docs into')
    .alias(   'b', 'branch')
    .describe('b', 'branch on the remote repository to work with')
    .demand(  'fs')
    .alias(   'fs', 'sources')
    .describe('fs', 'one or more folders containing the source files to extract docs from')
    .alias(   'fx', 'excludes')
    .describe('fx', 'one or more folders to exclude (including their children) from extracting docs')
    .default( 'fp', ".+\\.js?$")
    .alias(   'fp', 'pattern')
    .describe('fp', 'file pattern, defaults to ".+\\.js$"')
    .demand(  'p')
    .alias(   'p', 'project')
    .describe('p', 'project folder name in the docs repo')
    .describe('plug', 'a module name that is a jsdoc or docworks plugin')
    .describe('dryrun', 'dry run - do not push to remote repo')
    .parse(process.argv.slice(3));

  let remote = argv.remote;
  let branch = argv.branch;
  let sources = argv.sources;
  let excludes = argv.excludes?(Array.isArray(argv.excludes)?argv.excludes:[argv.excludes]):[];
  let pattern = argv.pattern;
  let project = argv.project;
  let dryrun = !!argv.dryrun;
  let plugins = resolvePlugins(argv.plug);

  tmp.dir().then(o => {
    return extractComparePush(remote, branch, o.path, project, {"include": sources, "includePattern": pattern, "exclude": excludes}, plugins, dryrun);
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

function tern() {
  const cmdDefinition = optimist
    .usage('Usage: $0 tern (-r [remote repo] | -s [services repo] ) -u [base url] -n [api name] -o [output file]')
    .alias(   'r', 'remote')
    .describe('r', 'remote repository to read docworks services files from')
    .alias(   'l', 'local')
    .describe('l', 'folder containing docwork service files')
    .demand(  'u')
    .alias(   'u', 'url')
    .describe('u', 'base url for the urls generated in tern')
    .demand(  'n')
    .alias(   'n', 'name')
    .describe('n', 'API name')
    .demand(  'o')
    .alias(   'o', 'out')
    .describe('o', 'output file')
    .describe('plug', 'a module name that is a docworks tern plugin');
  let argv = cmdDefinition
    .argv;

  let remote = argv.remote;
  let local = argv.local;
  let baseUrl = argv.url;
  let apiName = argv.name;
  let outputFileName = argv.out;
  let plugins = resolvePlugins(argv.plug);

  if (!remote && !local || (!!remote && !!local)) {
    console.log(cmdDefinition.help());
    process.exit(1);
  }

  return runTern(remote, local, baseUrl, apiName, outputFileName, plugins)
    .catch(() => {
      process.exit(1);
    });
}
