module.exports.extendDocworksKey = 'eventType';
module.exports.ternProperty = function ternProperty(extraData, tern) {
  tern['!eventType'] = 'hello';
}
module.exports.ternOperation = function ternOperation(extraData, tern) {
  tern['!eventType'] = 'hello';
}
module.exports.ternMessage = function ternMessage(extraData, tern) {
  tern['!eventType'] = 'hello';
}
