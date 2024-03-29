const template_ = require('lodash/template')
const $wFixer = require('./$w-fixer')
const { convertTreeToString, dtsNamespace } = require('./dts-generator')
const {
  convertCallbackToType,
  convertMessageToType,
  convertServiceToInterface,
  convertServiceToModule
} = require('./dts-converters')
const {$W_NAME} = require('./multiple-files/constants')

function ensureNamespace(namespaces, name, { jsDocComment } = {}) {
  let namespace = namespaces[name]
  if (!namespace) {
    namespace = dtsNamespace(name, { jsDocComment })
    namespaces[name] = namespace
  }
  return namespace
}

const is$w = name => name === $W_NAME

function handleServiceAsModule(
  service,
  modules,
  namespaces,
  { documentationGenerator } = {}
) {
  // service should ber derived from display non for non $w
  const serviceName =  is$w(service.name) || !service.displayName ? service.name : service.displayName

  if (modules[serviceName || service.name]) {
    throw new Error(`Module ${serviceName} already defined`)
  }
  const module = convertServiceToModule(service, { documentationGenerator }, serviceName)
  if (module.members.length > 0) {
    modules[serviceName] = module
  }

  const messages = service.messages
  const callbacks = service.callbacks

  if (messages.length > 0 || callbacks.length > 0) {
    const namespace = ensureNamespace(namespaces, serviceName)

    messages.forEach(message => {
      const type = convertMessageToType(message)
      namespace.members.push(type)
    })

    callbacks.forEach(callback => {
      const type = convertCallbackToType(callback)
      namespace.members.push(type)
    })
  }
}

function handleServiceAsNamespace(
  service,
  namespaces,
  { documentationGenerator } = {}
) {
  const serviceName = service.name

  const namespace = ensureNamespace(namespaces, service.memberOf)

  const intf = convertServiceToInterface(service, { documentationGenerator })
  namespace.members.push(intf)

  const messages = service.messages
  const callbacks = service.callbacks
  if (messages.length > 0 || callbacks.length > 0) {
    const innerNamespace = dtsNamespace(serviceName)

    messages.forEach(message => {
      const type = convertMessageToType(message)
      innerNamespace.members.push(type)
    })

    callbacks.forEach(callback => {
      const type = convertCallbackToType(callback)
      innerNamespace.members.push(type)
    })

    namespace.members.push(innerNamespace)
  }
}


function dts(
  services,
  { run$wFixer = false, summaryTemplate, ignoredModules = [], ignoredNamespaces = [] } = {}
) {
  const namespaces = {}
  const modules = {}
  let documentationGenerator = ({summary}) => summary

  if (summaryTemplate) {
    documentationGenerator = values => {
      return template_(summaryTemplate)({model: values})
    }
  }

  services.forEach(service => {
    if (!service.memberOf) {
      handleServiceAsModule(service, modules, namespaces, {documentationGenerator})
    } else {
      handleServiceAsNamespace(service, namespaces, {documentationGenerator})
    }
  })


  // remove ignored modules and namespaces from output
  ignoredNamespaces.forEach(namespace => delete namespaces[namespace])
  ignoredModules.forEach(module => delete modules[module])

  if (run$wFixer) {
    $wFixer(modules, namespaces)
  }

  return [convertTreeToString(modules), convertTreeToString(namespaces)].join('')
}

module.exports = dts
