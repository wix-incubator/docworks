const isEqual = require('lodash/isEqual')
const CUSTOM_LABELS_KEY = 'customLabels'
const CUSTOM_LABELS_TAG = 'custom-labels'

function defineTags(dictionary) {
  dictionary.defineTag(CUSTOM_LABELS_TAG, {
      mustNotHaveValue: false,
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

function extendDocworks(doclet) {
  if (doclet.customLabels) {
    return {extraValue: doclet.customLabels}
  }
}

function mergeCustomLabels(newCustomLabels, repoCustomLabels) {
  return {value: newCustomLabels, changed: !isEqual(newCustomLabels, repoCustomLabels)}
}

exports.extendDocworksKey = CUSTOM_LABELS_KEY
exports.extendDocworksService = extendDocworks
exports.extendDocworksProperty = extendDocworks
exports.extendDocworksOperation = extendDocworks
exports.extendDocworksMessage = extendDocworks
exports.docworksMergeService = mergeCustomLabels
exports.docworksMergeProperty = mergeCustomLabels
exports.docworksMergeOperation = mergeCustomLabels
exports.docworksMergeMessage = mergeCustomLabels
module.exports.defineTags = defineTags
module.exports.extendDocworksService = extendDocworks
module.exports.docworksMergeService = mergeCustomLabels
