#!/usr/bin/env node
var path = require('path');
var fs = require('fs');

require('css-modules-require-hook')({
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    extensions: ['.scss', '.css'],
    camelCase: true
});

var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelrc);
require("babel-polyfill");

global.__CLIENT__ = false;
global.__SERVER__ = true;

require('../src/server');
