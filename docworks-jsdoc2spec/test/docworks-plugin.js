
exports.extendDocworksService = function(doclet) {
  return {pluginGenerated: 'service plugin visited'}
};

exports.extendDocworksProperty = function(doclet) {
  return {pluginGenerated: 'property plugin visited'}
};

exports.extendDocworksOperation = function(doclet) {
  return {pluginGenerated: 'operation plugin visited'}
};

exports.extendDocworksMessage = function(doclet) {
  return {pluginGenerated: 'message plugin visited'}
};