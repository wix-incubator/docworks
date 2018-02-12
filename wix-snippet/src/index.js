let path = require('path');
let fs = require('fs');
let logger = console;

exports.setSnippetsDir = function(value) {
  // jsdoc with requizzle loads the modules twice - so the only way to move config between the two runs is using global
  global.wixJsDocPluginSnippetsDir = value;
};

exports.setLogger = function(value) {
  logger = value;
};

exports.init = function(param) {
  exports.setSnippetsDir(param);
}

let reportedConfigError = false;
exports.defineTags = function(dictionary) {
  dictionary.defineTag('snippet', {
    mustHaveValue : true,
    canHaveType: false,
    canHaveName : true,
    onTagged: function(doclet, tag) {
      if (!global.wixJsDocPluginSnippetsDir) {
        if (!reportedConfigError) {
          logger.error('ERROR: The Wix Snippet jsdoc plugin requires a configuration of snippets dir');
          reportedConfigError = true;
        }
        return;
      }
      let snippet = tag.value;
      let p = path.join(global.wixJsDocPluginSnippetsDir, snippet.name);
      try {
        let ext = path.extname(p);
        let lang = "javascript";
        if(ext === 'html' || ext === '.html') {
          lang = "html";
        }
        let contents = fs.readFileSync(p, 'utf8');
        doclet.examples = doclet.examples || [];
        doclet.examples.push(`<caption>${snippet.defaultvalue}</caption>\n${contents}`);
      } catch(error) {
        if (error.code === 'ENOENT')
          logger.error('ERROR: The @snippet tag - file \'' + p + '\' not found. File: ' + doclet.meta.filename + ' line: ' + doclet.meta.lineno);
        else
          logger.error(error);
      }
    }
  });
};