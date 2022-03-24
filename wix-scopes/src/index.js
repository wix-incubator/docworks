const SCOPES_TAG_NAME = 'scopes'
const FRONTEND_SCOPE = 'frontend'
const BACKEND_SCOPE = 'backend'
const UNIVERSAL_SCOPES = [FRONTEND_SCOPE, BACKEND_SCOPE]

function extractScopesFromTag(tag){
  debugger
  if(!tag || !tag.value){
    return UNIVERSAL_SCOPES
  }

  const isScropesTagValid = tag.value.match(/^\[[a-zA-Z,]*\]$/)
  if(!isScropesTagValid){
    throw new Error(`scopes tag ${tag.value} is not valid`)
  }

  const scopesTagWithoutBrackets = tag.value.slice(1,tag.value.length-1)

  if(!scopesTagWithoutBrackets){
    throw new Error(`scopes tag ${tag.value} value is empty`)
  }
  const scopesValues = scopesTagWithoutBrackets.split(',')

  for(const scopeValue of scopesValues){
    if(!UNIVERSAL_SCOPES.includes(scopeValue)){
      throw new Error(`unknown scope value ${scopeValue}`)
    }
  }

  return scopesValues
}

exports.defineTags = function(dictionary) {
  dictionary.defineTag(SCOPES_TAG_NAME, {
    mustNotHaveValue : true,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      doclet[SCOPES_TAG_NAME] = extractScopesFromTag(tag)
    }
  })
}

exports.extendDocworksKey = SCOPES_TAG_NAME

function extendDocworks(doclet) {
  return {extraValue: doclet[SCOPES_TAG_NAME]}
}
exports.extendDocworksService = extendDocworks

function mergeQueryableValue(newValue, oldValue) {
  return {value: newValue, changed: newValue !== oldValue}
}

exports.docworksMergeService = mergeQueryableValue
