const isEqual = require('lodash.isequal')
let logger = console

const ONE_OF_TAG = 'oneof'
const ONE_OF_ELEMENT_KEY = 'oneOfGroups'

exports.setLogger = function(value) {
  logger = value
}

exports.defineTags = function(dictionary) {
  dictionary.defineTag(ONE_OF_TAG, {
    canHaveType: false,
    canHaveName : true,
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      let hasDuplicatedProperty = false
      const oneOfGroups = doclet[ONE_OF_TAG] || []
      const newOneOfGroup = {
        name: tag.value.name,
        members: tag.value.description.split(' ')
      }

      oneOfGroups.forEach(currentOneOfGroup => {
        const duplicatedMembers = currentOneOfGroup.members.filter(member =>newOneOfGroup.members.includes(member))
        if(duplicatedMembers.length > 0){
          hasDuplicatedProperty = true
          logger.error(`Members ${duplicatedMembers} mark as oneOf for two different groups - ${currentOneOfGroup.name} & ${newOneOfGroup.name}`)
        }
      })

      if(!hasDuplicatedProperty) {
        oneOfGroups.push(newOneOfGroup)
      }
      doclet[ONE_OF_TAG] = oneOfGroups
    }
  })
}

exports.extendDocworksKey = ONE_OF_ELEMENT_KEY

function extendDocworks(doclet, element) {
  const oneOfGroups = doclet[ONE_OF_TAG]

  if(oneOfGroups) {
    oneOfGroups.forEach(currentOneOfGroup => {
      currentOneOfGroup.members.forEach(memberName => {
        const member = element.members.find(m => m.name === memberName)
        member.optional = true
      })
    })
  }

  return {extraValue: oneOfGroups}
}

exports.extendDocworksMessage = extendDocworks

function mergeOneOfValue(newOneOfGroups, repoOneOfGroups) {
  const changed = !isEqual(newOneOfGroups, repoOneOfGroups)

  return {value: newOneOfGroups, changed}
}

exports.docworksMergeMessage = mergeOneOfValue
