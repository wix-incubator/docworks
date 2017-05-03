var path = require("path");
var fs = require('fs');
var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelrc);

const {cli, env} = require('./lib/jsdoc-loader').default;

function build() {

    cli.setVersionInfo();
    env.conf = {
        "tags": {
            "allowUnknownTags": true,
            dictionaries: ['jsdoc', 'closure']
        },
        "opts": {
            "lenient": false
        },
        "source": {
            "include": [
                "test/"
            ],
            "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
            "excludePattern": "(^|\\/|\\\\)_"
        },
        "templates": {
            "snippetsDir": "./tmp/examples",
            "migrateExamples": false,
            "apiTitle" : "Router API",
            "groupNavByTopNamespace": true,
            "fullSignatures": false,
            "readme" : "README.md",
            "tern": {
                "name": "wix",
                "url": "http://localhost:63342/js-sdk/jsdoc/wixdocs/"
            },
            "appendices" : false
        },
        encoding: 'utf8'
    };

    // set the template to process the jsdoc results
    env.conf.opts.template = path.join(__dirname, 'lib');
    env.opts.template = env.conf.opts.template;

    // required to clear the scanned files for re-running jsdoc
    env.sourceFiles = [];
    env.opts._ = [];

    // run jsdoc
    return cli.scanFiles()
        .createParser()
        .parseFiles()
        .processParseResults();
}

module.exports.build = build;