const EXPERIMENTAL_TAG_NAME = 'experimental'

const defineTags = function(dictionary) {
  dictionary.defineTag(EXPERIMENTAL_TAG_NAME, {
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      doclet[EXPERIMENTAL_TAG_NAME] = tag.value
    }
  })
}

function extendDocworksItem(doclet) {
  return { extraValue: doclet[EXPERIMENTAL_TAG_NAME] }
}

function docworksMergeService(newValue, oldValue) {
  return { value: newValue, changed: newValue !== oldValue }
}

module.exports = {
  defineTags,
  extendDocworksKey: EXPERIMENTAL_TAG_NAME,
  extendDocworksService: extendDocworksItem,
  extendDocworksOperation: extendDocworksItem,
  extendDocworksProperty: extendDocworksItem,
  docworksMergeService
}
