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

      const newGroupName = tag.value.name
      const newGroupMembersString = tag.value.description

      if(!newGroupMembersString) {
        logger.error(`oneof group ${newGroupName} must include description with list of properties names`)
        return
      }

      const newOneOfGroup = {
        name: newGroupName,
        members: newGroupMembersString.split(' ')
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

  if(!oneOfGroups) {
    return
  }

  oneOfGroups.forEach(currentOneOfGroup => {
    const existingMembers = currentOneOfGroup.members.filter(memberName => {
      const member = element.members.find(m => m.name === memberName)
      if(!member) {
        logger.error(`oneof group ${currentOneOfGroup.name} contains non existing property ${memberName}`)
        return false
      }
      member.optional = true
      return true
    })
    currentOneOfGroup.members = existingMembers
  })

  return {extraValue: oneOfGroups}
}

exports.extendDocworksMessage = extendDocworks

function mergeOneOfValue(newOneOfGroups, repoOneOfGroups) {
  const changed = !isEqual(newOneOfGroups, repoOneOfGroups)

  return {value: newOneOfGroups, changed}
}

exports.docworksMergeMessage = mergeOneOfValue
