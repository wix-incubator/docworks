var path = require("path");
var ogRequire = require;

(function(args) {
    'use strict';
    if(args[0] && typeof args[0] === 'object') {
        var targetPath = ogRequire.resolve('jsdoc/lib/jsdoc/app.js');
        var rootPath = targetPath.replace('lib/jsdoc/app.js', '');

        require = require('requizzle')({
            requirePaths: {
                before: [targetPath.replace('jsdoc/app.js', '')],
                after: [path.join(rootPath, 'node_modules')]
            },
            infect: true
        });
    }
})(Array.prototype.slice.call(arguments, 0));

const env = (function() {
    'use strict';
  const env = require(ogRequire.resolve('jsdoc/lib/jsdoc/env'));
  env.dirname = path.resolve(ogRequire.resolve('jsdoc/lib/jsdoc/env'), '../../../');
  return env;
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

