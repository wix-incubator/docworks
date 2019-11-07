const $wFixer = require('./$w-fixer')
const {
  convertTreeToString,
  dtsNamespace
} = require('./dts-generator')
const {
  convertCallbackToType,
  convertMessageToType,
  convertServiceToInterface,
  convertServiceToModule
} = require('./dts-converters')

function ensureNamespace(namespaces, name, {jsDocComment} = {}) {
  let namespace = namespaces[name]
  if (!namespace) {
    namespace = dtsNamespace(name, {jsDocComment})
    namespaces[name] = namespace
  }
  return namespace
}

function handleServiceAsModule(service, modules, namespaces) {
  const serviceName = service.name

  if (modules[serviceName]) {
    throw new Error(`Module ${serviceName} already defined`)
  }
  const module = convertServiceToModule(service)
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

function handleServiceAsNamespace(service, namespaces) {
  const serviceName = service.name

  const namespace = ensureNamespace(namespaces, service.memberOf)

  const intf = convertServiceToInterface(service)
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

function dts(services, {run$wFixer = false} = {}) {
  let namespaces = {}
  let modules = {}

  services.forEach(service => {
    if (!service.memberOf) {
      handleServiceAsModule(service, modules, namespaces)
    } else {
      handleServiceAsNamespace(service, namespaces)
    }
  })

  if(run$wFixer){
    $wFixer(modules, namespaces)
  }

  return [convertTreeToString(modules), convertTreeToString(namespaces)].join('')
}

module.exports = dts
