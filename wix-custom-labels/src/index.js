const isEqual = require('lodash.isequal')
const CUSTOM_LABELS_KEY = 'customLabels'
const CUSTOM_LABELS_TAG = 'customlabels'

exports.defineTags = function(dictionary) {
  dictionary.defineTag(CUSTOM_LABELS_TAG, {
      mustHaveValue: true,
      onTagged: function (doclet, tag) {
        doclet.customLabels = []
        tag.value.split(' ').forEach(customLabel => {
          doclet.customLabels.push({'id': customLabel})
        })
      }
    }
  )
}

exports.extendDocworksKey = CUSTOM_LABELS_KEY

function extendDocworks(doclet) {
  if (doclet.customLabels) {
    return {extraValue: doclet.customLabels}
  }
}
exports.extendDocworksService = extendDocworks
exports.extendDocworksOperation = extendDocworks

function mergeCustomLabels(newCustomLabels, repoCustomLabels) {
  return {value: newCustomLabels, changed: !isEqual(newCustomLabels, repoCustomLabels)}
}

exports.docworksMergeService = mergeCustomLabels
exports.docworksMergeOperation = mergeCustomLabels

