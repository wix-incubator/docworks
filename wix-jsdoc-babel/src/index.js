let jsdocBabel = require('jsdoc-babel');

exports.setExtensions = function(value) {
  global.env.conf.babel.extensions = value;
};

exports.init = function(param) {
  exports.setExtensions(param.split(','));
};


exports.handlers = jsdocBabel.handlers;
