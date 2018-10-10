
exports.extendDocworksKey = 'pluginGenerated';

exports.extendDocworksService = function(doclet) {
  return 'service plugin visited'
};

exports.extendDocworksProperty = function(doclet) {
  return 'property plugin visited'
};

exports.extendDocworksOperation = function(doclet) {
  return 'operation plugin visited'
};

exports.extendDocworksMessage = function(doclet) {
  return 'message plugin visited'
};

exports.extendDocworksDocs = function(doclet) {
  return 'docs plugin visited'
};

exports.extendDocworksDocsExample = function(doclet) {
  return 'example plugin visited'
};