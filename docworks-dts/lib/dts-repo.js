const template_ = require('lodash/template')
const $wFixer = require('./$w-fixer')
const { convertTreeToString, dtsNamespace } = require('./dts-generator')
const {
  convertCallbackToType,
  convertMessageToType,
  convertServiceToInterface,
  convertServiceToModule
} = require('./dts-converters')

function ensureNamespace(namespaces, name, { jsDocComment } = {}) {
  let namespace = namespaces[name]
  if (!namespace) {
    namespace = dtsNamespace(name, { jsDocComment })
    namespaces[name] = namespace
  }
  return namespace
}

function handleServiceAsModule(
  service,
  modules,
  namespaces,
  { documentationGenerator } = {}
) {
  const serviceName = service.name

  if (modules[serviceName]) {
    throw new Error(`Module ${serviceName} already defined`)
  }
  const module = convertServiceToModule(service, { documentationGenerator })
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

function handleSubServices(service, parent) {
  const serviceName = service.name
  const messages = service.messages
  const callbacks = service.callbacks
  console.log("^^^^^^^^^^^^^^^^^^^^^", "serviceName => ", serviceName, "^^^^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^^^^", "messages => ", messages.map(m => `${parent}.${serviceName}.${m.name}`), "^^^^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^^^^", "callbacks => ", callbacks.map(c => `${parent}.${serviceName}.${c.name}`), "^^^^^^^^^^^^^^^^^^^^^")
  console.log("*********************", "SUB END", "*********************")
}

function handleRootServices(service) {
  const serviceName = service.name
  const messages = service.messages
  const callbacks = service.callbacks
  console.log("*********************", "ROOT START", "*********************")
  console.log("^^^^^^^^^^^^^^^^^^^^^", "serviceName => ", serviceName, "^^^^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^^^^", "messages => ", messages.map(m => `${serviceName}.${m.name}`), "^^^^^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^^^^^", "callbacks => ", callbacks.map(c => `${serviceName}.${c.name}`), "^^^^^^^^^^^^^^^^^^^^^")
  console.log("*********************", "ROOT END", "*********************")
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

  const rootServices = {}
  const subServices = []

  services.forEach(service => {
    if (!service.memberOf) {
      // handleRootServices(service)
      rootServices[service.name] = {instance: service, sub: {}} 
      handleServiceAsModule(service, modules, namespaces, {documentationGenerator})
    } else {
      // handleSubServices(service, service.memberOf)
      subServices.push(service)
      handleServiceAsNamespace(service, namespaces, {documentationGenerator})
    }
  })

  subServices.forEach(sub => {
    if(rootServices[sub.memberOf]) {
      Object.assign(rootServices[sub.memberOf].sub, {[sub.name] : sub})
    }
  })
  // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
  // Object.keys(rootServices).forEach(root => {
  //   Object.keys(rootServices[root].sub).forEach(s => {
  //     console.log(`${root}.${s}`)
  //   })
  // })
  // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

  // remove ignored modules and namespaces from output
  ignoredNamespaces.forEach(namespace => delete namespaces[namespace])
  ignoredModules.forEach(module => delete modules[module])

  if (run$wFixer) {
    $wFixer(modules, namespaces)
  }

  return [convertTreeToString(modules), convertTreeToString(namespaces)].join('')
}

module.exports = dts
