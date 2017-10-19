#!/usr/bin/env node
require("babel-register");
require("babel-polyfill");
var tmp = require('tmp-promise');
var extractDocs = require('../src/extract-compare-push').default;
var validate = require('../src/validate').default;
var optimist = require('optimist');

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

function ecp() {
  var argv = optimist
    .usage('Usage: $0 ecp -r [remote repo] -s [local sources] -p [file pattern]')
    .demand('r')
    .alias('r', 'remote')
    .describe('r', 'remote repository to merge docs into')
    .demand('s')
    .alias('s', 'sources')
    .describe('s', 'folder containing the source files to extract docs from')
    .default('p', ".+\\.js?$")
    .alias('p', 'pattern')
    .describe('p', 'file pattern, defaults to ".+\\.js$"')
    .parse(process.argv.slice(3));

  let remote = argv.remote;
  let sources = argv.sources;
  let pattern = argv.pattern;

  tmp.dir().then(o => {
    console.log('working directory', o.path);
    return extractDocs(remote, o.path, {"include": sources, "includePattern": pattern});
  });
}

function validateCommand() {
  var argv = optimist
    .usage('Usage: $0 validate -s [local sources] -p [file pattern]')
    .demand('s')
    .alias('s', 'sources')
    .describe('s', 'folder containing the source files to extract docs from')
    .default('p', ".+\\.js?$")
    .alias('p', 'pattern')
    .describe('p', 'file pattern, defaults to ".+\\.js$"')
    .parse(process.argv.slice(3));

  let sources = argv.sources;
  let pattern = argv.pattern;

  if (!validate({"include": sources, "includePattern": pattern}))
    process.exit(1);
}
