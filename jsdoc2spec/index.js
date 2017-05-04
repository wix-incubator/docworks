// var path = require("path");
var fs = require('fs');
var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelrc);

require('./lib/jsdoc-runner').default({
    "include": [
        "test/service.js"
    ],
    "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
    "excludePattern": "(^|\\/|\\\\)_"
});

