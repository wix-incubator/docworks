const QUERYABLE = 'queryable'

exports.defineTags = function(dictionary) {
  dictionary.defineTag(QUERYABLE, {
    mustNotHaveValue : true,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet) {
      doclet[QUERYABLE] = true
    }
  })
}

exports.extendDocworksKey = QUERYABLE

function extendDocworks(doclet) {
  return {extraValue: doclet[QUERYABLE]}
}
exports.extendDocworksService = extendDocworks

function mergeQueryableValue(newValue, oldValue) {
  return {value: newValue, changed: newValue !== oldValue}
}

exports.docworksMergeService = mergeQueryableValue
