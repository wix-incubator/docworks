var fs = require('fs');
var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelrc);

const jsdoc = require('./lib/jsdoc-loader').default;

function build() {

    jsdoc.cli.setVersionInfo();
    console.log(jsdoc.env);
}


build();