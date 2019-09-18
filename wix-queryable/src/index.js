const TAG_NAME = 'queryable'

exports.defineTags = function(dictionary) {
  dictionary.defineTag(TAG_NAME, {
    mustNotHaveValue : true,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet) {
      doclet[TAG_NAME] = true
    }
  })
}

exports.extendDocworksKey = TAG_NAME

function extendDocworks(doclet) {
  return {extraValue: doclet[TAG_NAME]}
}
exports.extendDocworksService = extendDocworks

function mergeQueryableValue(newValue, oldValue) {
  return {value: newValue, changed: newValue !== oldValue}
}

exports.docworksMergeService = mergeQueryableValue
