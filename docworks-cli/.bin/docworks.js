#!/usr/bin/env node
require("babel-register");
require("babel-polyfill");
var tmp = require('tmp-promise');
var extractDocs = require('../src/extract-compare-push').default;
var optimist = require('optimist');

if (process.argv.length < 3) {
  printUsage();
  process.exit(1);
}

var command = process.argv[2];
if (command === 'ecp') {
  var argv = optimist
    .usage('Usage: $0 ecp -r [remote repo] -s [local sources]')
    .demand('r')
    .alias('r', 'remote')
    .describe('r', 'remote repository to merge docs into')
    .demand('s')
    .alias('s', 'sources')
    .describe('s', 'folder containing the source files to extract docs from')
    .parse(process.argv.slice(3));

  let remote = argv.remote;
  let sources = argv.sources;

  tmp.dir().then(o => {
    console.log('working directory', o.path);
    return extractDocs(remote, o.path, {"include": sources, "includePattern": ".+\\.(js)?$"});
  });
}
else {
  printUsage(1);
  process.exit(1);
}

function printUsage() {
  console.log('Usage: ' + optimist.$0 + ' [command] [options...]');
  console.log('');
  console.log('Commands:');
  console.log('  ecp      extract, compare and push docs from sources to a docs git repository');
}

