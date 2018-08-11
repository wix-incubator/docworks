#!/usr/bin/env node
import 'babel-polyfill';
import optimist from 'optimist';
import runCli from "./index";
import {resolvePlugins} from './plugins';

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
  .describe('plug', 'a module name that is a docworks tern plugin')
  .argv;

let sources = argv.sources;
let url = argv.url;
let name = argv.name;
let outputFileName = argv.out;
let plugins = resolvePlugins(argv.plug);

function start() {
  runCli(sources, url, name, outputFileName, plugins)
    .then(() => {
      console.log('tern file saved to ' + outputFileName);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

start();