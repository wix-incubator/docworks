/* eslint-disable no-unused-vars */
import {Example, Docs} from 'docworks-model'

exports.extendDocworksKey = 'pluginGenerated'

exports.extendDocworksService = function(doclet, service) {
  return {extraValue: 'service plugin visited'}
}

exports.extendDocworksProperty = function(doclet, property) {
  return {extraValue: 'property plugin visited'}
}

exports.extendDocworksOperation = function(doclet, operation) {
  return {extraValue: 'operation plugin visited'}
}

exports.extendDocworksMessage = function(doclet, message) {
  return {extraValue: 'message plugin visited'}
}

exports.extendDocworksDocs = function(doclet, docs) {
  const newDocs = Docs('plugin updated summary', docs.description, docs.links, docs.examples)
  return {extraValue: 'docs plugin visited', element: newDocs}
}

exports.extendDocworksDocsExample = function(doclet, example) {
  const newExample = Example(example.title, 'plugin updated body')
  return {extraValue: 'example plugin visited', element: newExample}
}
