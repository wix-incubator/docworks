var path = require("path");
var ogRequire = require;

(function(args) {
    'use strict';
    if(args[0] && typeof args[0] === 'object') {
        var targetPath = ogRequire.resolve('jsdoc/lib/jsdoc/app.js');
        var rootPath = targetPath.replace('lib/jsdoc/app.js', '');

        // we should be on Node.js
        args = [rootPath, process.cwd()];
        require = require('requizzle')({
            requirePaths: {
                before: [targetPath.replace('jsdoc/app.js', '')],
                after: [path.join(rootPath, 'node_modules')]
            },
            infect: true
        });
    }
    require(ogRequire.resolve('jsdoc/lib/jsdoc/util/runtime')).initialize(args);
})(Array.prototype.slice.call(arguments, 0));

const env = (function() {
    'use strict';
    return require(ogRequire.resolve('jsdoc/lib/jsdoc/env'));
})();

const app = (function() {
    'use strict';
    return require(ogRequire.resolve('jsdoc/lib/jsdoc/app'));
})();

var cli = require(ogRequire.resolve('jsdoc/cli'));

export default {
    env: env,
    app: app,
    cli: cli
}

