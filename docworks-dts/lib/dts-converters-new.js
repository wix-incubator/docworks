const { validServiceName } = require('./utils')
const isObject_ = require('lodash/isObject')
const isArray_ = require('lodash/isArray')
const isEmpty_ = require('lodash/isEmpty')
const isString_ = require('lodash/isString')
const has_ = require('lodash/has')
const {
  dtsConst,
  dtsFunction,
  dtsFunctionTypeAlias,
  dtsInterface,
  dtsMethod,
  dtsModule,
  dtsParameter,
  dtsNamespace,
  dtsProperty,
  dtsObjectTypeAlias
} = require('./dts-generator')

const fullServiceName = service =>
  service.memberOf ? `${service.memberOf}.${service.name}` : service.name

const generateType = (type, parentModuleName) => {
  if (type.startsWith(parentModuleName)) {
    return type.replace(`${parentModuleName}.`, "")
  }
  else if (type.includes(`${parentModuleName}.`)) {
    const splitedParts = type.split(`${parentModuleName}.`)
    return `${parentModuleName}.${splitedParts[splitedParts.length - 1]}`
  }
  return type
}

const fixType = (type, parentModuleName) => {
  if (parentModuleName) {
    if (isString_(type)) {
      return generateType(type, parentModuleName)
    }
    else if(isObject_(type) && has_(type, "name") && (type.name === 'Array' || type.name === 'Promise')) {
      type.typeParams = type.typeParams.map(t => {
        if (isString_(t)) {
          return generateType(t, parentModuleName)
        }
        console.log("unknow type SECOND IF => ", t)
        return t
      })
      return type
    }
    else if (isArray_(type)) {
      type = type.map(t => {
        if (isString_(t)) {
          return generateType(t, parentModuleName)
        }
        console.log("unknow type THIRD IF => ", t)
        return t
      })
      return type
    }
    console.log("START UNFIXED TYPE ", type, " typeof =>" + typeof type," parentModuleName ", parentModuleName, "END")
  }
  return type
}

function convertOperationParamToParameters(param, service) {
  const { name, type, optional, doc, spread } = param
  
  const fixedType = fixType(type, service.name)
  // console.log("START type => ", type, service.name, fixedType, "END")
  return dtsParameter(name, fixedType, { spread, optional, jsDocComment: doc })
}

function convertOperationToMethod(
  service,
  operation,
  { documentationGenerator }
) {
  const { name, params, ret, docs } = operation
  const parameters = params.map(p => convertOperationParamToParameters(p, service))
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: fullServiceName(service),
    member: name,
    eventType: operation.extra && operation.extra.eventType ? operation.extra.eventType : null,
  })

  return dtsMethod(name, parameters, fixType(ret.type, service.name), { jsDocComment })
}  

function convertPropertyToProperty(
  service,
  property,
  { documentationGenerator }
) {
  const readonly = property.get && !property.set
  const jsDocComment = documentationGenerator({
    summary: property.docs.summary,
    service: fullServiceName(service),
    member: property.name
  })

  return dtsProperty(property.name, fixType(property.type, service.name), { readonly, jsDocComment })
}

function convertServiceToInterface(service, { documentationGenerator }) {
  const properties = service.properties.map(property =>
    convertPropertyToProperty(service, property, { documentationGenerator })
  )
  const operations = service.operations.map(operation =>
    convertOperationToMethod(service, operation, { documentationGenerator })
  )
  const members = properties.concat(operations)
  const baseTypes = service.mixes.map(validServiceName)
  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: fullServiceName(service)
  })

  return dtsInterface(service.name, { members, baseTypes, jsDocComment })
}

function convertPropertyToConst(service, property, { documentationGenerator }) {
  property.type = fixType(property.type, service.name)
  // console.log("type => ", property.type, "END")
  const jsDocComment = documentationGenerator({
    summary: property.docs.summary,
    service: fullServiceName(service),
    member: property.name
  })
  return dtsConst(property, { jsDocComment })
}

function convertOperationToFunction(
  service,
  operation,
  { documentationGenerator }
) {
  const { name, params, ret, docs } = operation
  const parameters = params.map(p => convertOperationParamToParameters(p, service))
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: fullServiceName(service),
    member: name
  })

  return dtsFunction(name, parameters, fixType(ret.type, service.name), { jsDocComment })
}


function convertMessageMemberToProperty(member, service) {
  const { name, type, optional, doc } = member
  const fixedType = fixType(type, service.name)
  // console.log("type => ", type, "END")
  return dtsProperty(name, fixedType, { optional, jsDocComment: doc })
}

function convertMessageToObjectType(message, service) {
  const jsDocComment = message.docs.summary
  const properties = message.members ? message.members.map(m => convertMessageMemberToProperty(m, service)): []

  return dtsObjectTypeAlias(message.name, properties, { jsDocComment })
}

function convertCallbackToFunctionType(callback, service) {
  const { name, params = [], ret, docs } = callback
  const fixedType = fixType(ret.type, service.name)
  // console.log("type => ", ret.type, "END")
  const parameters = params.map( p => convertOperationParamToParameters(p, service))
  const jsDocComment = docs.summary

  return dtsFunctionTypeAlias(name, parameters, fixedType, { jsDocComment })
}

function extractDataFromService(service, documentationGenerator) {
  const properties = service.properties.map(property =>
    convertPropertyToConst(service, property, { documentationGenerator })
  )
  const operations = service.operations.map(operation =>
    convertOperationToFunction(service, operation, { documentationGenerator })
  )

    const types = []
    service.messages.forEach(message => {
      const type = convertMessageToObjectType(message, service)
      types.push(type)
    })

    const callbacks = []
    service.callbacks.forEach(callback => {
      const type = convertCallbackToFunctionType(callback, service)
      callbacks.push(type)
    })
    return properties.concat(operations).concat(types).concat(callbacks)
}

function convertMessageToType(service, message) {
  const jsDocComment = message.docs.summary
  const properties = message.members.map(p => convertMessageMemberToProperty(p, service))

  return dtsObjectTypeAlias(message.name, properties, { jsDocComment })
}

function convertCallbackToType(service, callback) {
  const { name, params, ret, docs } = callback
  const parameters = params.map(p => convertOperationParamToParameters(p, service))
  const jsDocComment = docs.summary

  return dtsFunctionTypeAlias(name, parameters, fixType(ret.type, service.name), { jsDocComment })
}

function covert$wServiceToNamespace() {}

function convertServiceToNamespace(
  service,
  parentService,
  { documentationGenerator } = {}
) {
  //TODO:: need to handle service.sub.sub etc...
  // service.memberOf = parentService.name
  const serviceName = service.name
  const namespace = dtsNamespace(serviceName)
  if (service.name === "TimeLine")debugger
  // here need to say this is the root module of the inteface parentService
  const intf = convertServiceToInterface(service, { documentationGenerator })
  namespace.members.push(intf)

  const messages = service.messages
  const callbacks = service.callbacks
  const sub = service.sub
  Object.keys(sub).forEach(subKey => {
    
    const subModule = sub[subKey]
    console.log("SUB >> ", subKey, "$$$$", subModule.memberOf)
    const subModuleInterface = convertServiceToInterface(subModule, { documentationGenerator })
    namespace.members.push(subModuleInterface)
  })
  if (messages.length > 0 || callbacks.length > 0) {
    const innerNamespace = dtsNamespace(serviceName)

    messages.forEach(message => {
      const type = convertMessageToType(service, message)
      innerNamespace.members.push(type)
    })

    callbacks.forEach(callback => {
      const type = convertCallbackToType(service, callback)
      innerNamespace.members.push(type)
    })


    namespace.members.push(innerNamespace)
  }
  return namespace
}

function convertServiceToNamespaceRecursivly({ service, namespace =  dtsNamespace(service.name), documentationGenerator } = {}) {
  if(!has_(service, "sub")) {
    return namespace
  }
  else {
    // the interface of the service should be at root module level
    debugger
    // all messages, callbacks, sub (should be inner namespace)
    const messages = service.messages
    const callbacks = service.callbacks
    if (messages.length > 0 || callbacks.length > 0) {
      messages.forEach(message => {
        const type = convertMessageToType(service, message)
        namespace.members.push(type)
      })
  
      callbacks.forEach(callback => {
        const type = convertCallbackToType(service, callback)
        namespace.members.push(type)
      })
    }
    const { sub } = service
    Object.keys(sub).forEach(subKey => {
      namespace.members.push(convertServiceToNamespaceRecursivly({ service: sub[subKey], namespace, documentationGenerator }))
    })
    return namespace
  }
}

function convertServiceToModule(service, sub, { documentationGenerator }) {
  
  let subSections = []
    Object.keys(sub).forEach(subKey => {
      const subSection = sub[subKey]
      if (subSection.memberOf !== '$w') {
        console.log(" NAME ", subSection.name)
        // if (subSection.name === 'WixBookingsQueryResult') {
        //   debugger
        // }
        // const namespace1 = convertServiceToNamespaceRecursivly({service: subSection, documentationGenerator })
        // const intf = convertServiceToInterface(service, { documentationGenerator })
        // subSections.push(intf)
        const namespace = convertServiceToNamespace(subSection, service, { documentationGenerator })
        subSections = subSections.concat(namespace.members)
      }
      else {
        // TODO:: handle $w
      }
    })

  const members = extractDataFromService(service, documentationGenerator)
    .concat(subSections)

  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: fullServiceName(service)
  })

  return dtsModule(service.name, { members, jsDocComment })
}

module.exports = {
  convertServiceToModule,
  covert$wServiceToNamespace
}
