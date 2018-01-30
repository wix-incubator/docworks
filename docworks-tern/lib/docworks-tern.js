#!/usr/bin/env node
import 'babel-polyfill';
import optimist from 'optimist';
import runCli from "./index";

let argv = optimist
  .usage('Usage: $0 docworks-tern -s [services repo] -u [base url]')
  .demand('s')
  .alias('s', 'sources')
  .describe('s', 'folder containing docwork service files')
  .demand('u')
  .alias('u', 'url')
  .describe('u', 'base url for the urls generated in tern')
  .demand('n')
  .alias('n', 'name')
  .describe('n', 'API name')
  .demand('o')
  .alias('o', 'out')
  .describe('o', 'output file')
  .argv;

let sources = argv.sources;
let url = argv.url;
let name = argv.name;
let outputFileName = argv.out;

function start() {
  runCli(sources, url, name, outputFileName)
    .then(() => {
      console.log('tern file saved to ' + outputFileName);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

start();