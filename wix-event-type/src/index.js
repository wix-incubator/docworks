
exports.defineTags = function(dictionary) {

  dictionary.defineTag('eventtype', {
    mustHaveValue : false,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      doclet.eventType = tag.value;
    }
  });
};

exports.extendDocworksKey = 'eventType';

function extendDocworks(doclet) {
  return doclet.eventType;
}
exports.extendDocworksService = extendDocworks;
exports.extendDocworksProperty = extendDocworks;
exports.extendDocworksOperation = extendDocworks;
exports.extendDocworksMessage = extendDocworks;

function mergeEventType(newEventType, repoEventType) {
  return {value: newEventType, changed: newEventType !== repoEventType};
}

exports.docworksMergeService = mergeEventType;
exports.docworksMergeProperty = mergeEventType;
exports.docworksMergeOperation = mergeEventType;
exports.docworksMergeMessage = mergeEventType;

function ternEventType(extraData, tern) {
  tern['!eventType'] = extraData;
}

exports.ternProperty = ternEventType;
exports.ternOperation = ternEventType;
exports.ternMessage = ternEventType;
