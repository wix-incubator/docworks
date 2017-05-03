var path = require("path");
const {cli, env} = require('./jsdoc-loader').default;

export default function run() {

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
                "test/service.js"
            ],
            "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
            "excludePattern": "(^|\\/|\\\\)_"
        },
        encoding: 'utf8'
    };

    // set to follow sub-directories
    env.opts.recurse = true;

    // set the template to process the jsdoc results
    // this folder has to have a file named publish.js
    env.conf.opts.template = __dirname;
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

