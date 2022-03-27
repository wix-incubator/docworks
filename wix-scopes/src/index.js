const {EmptyScopesError, InvalidScope, InvalidScopeSchema} = require('./ScopeErrors')

const SCOPES_TAG_NAME = 'scopes'
const FRONTEND_SCOPE = 'frontend'
const BACKEND_SCOPE = 'backend'
const UNIVERSAL_SCOPES = [FRONTEND_SCOPE, BACKEND_SCOPE]

const extractScopesFromTag = (tag) => {
  if(!tag || !tag.value){
    return UNIVERSAL_SCOPES
  }

  const isScropesTagValid = tag.value.match(/^\[[a-zA-Z,]*\]$/)
  if(!isScropesTagValid){
    throw new InvalidScopeSchema(tag.value)
  }

  const scopesTagWithoutBrackets = tag.value.slice(1,tag.value.length-1)

  if(!scopesTagWithoutBrackets){
    throw new EmptyScopesError()
  }
  const scopesValues = scopesTagWithoutBrackets.split(',')

  for(const scopeValue of scopesValues){
    if(!UNIVERSAL_SCOPES.includes(scopeValue)){
      throw new InvalidScope(scopeValue)
    }
  }

  return scopesValues
}

const defineScopesTag = (dictionary) => {
  dictionary.defineTag(SCOPES_TAG_NAME, {
    mustNotHaveValue : true,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      try{
        doclet[SCOPES_TAG_NAME] = extractScopesFromTag(tag)
      }
      catch(e){
        console.error(e.message, e.kind)
        doclet[SCOPES_TAG_NAME] = []
      }
    }
  })
}

const extendDocworks = (doclet) => {
  return {extraValue: doclet[SCOPES_TAG_NAME]}
}

const mergeScopesValue = (newValue, oldValue) => {
  return {value: newValue, changed: newValue !== oldValue}
}

module.exports = {
  extendDocworksKey: SCOPES_TAG_NAME,
  docworksMergeService: mergeScopesValue,
  extendDocworksService: extendDocworks,
  defineTags: defineScopesTag,
  UNIVERSAL_SCOPES,
  FRONTEND_SCOPE,
  BACKEND_SCOPE,
  SCOPES_TAG_NAME
}
