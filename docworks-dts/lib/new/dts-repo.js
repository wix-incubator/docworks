const dom = require('dts-dom')
const template_ = require('lodash/template')
const has_ = require('lodash/has')
const set_ = require('lodash/set')
const isEmpty_ = require('lodash/isEmpty')

const builtInTypes = {
  'string': dom.type.string,
  'boolean': dom.type.boolean,
  'number': dom.type.number,
  'Object': dom.type.any,
  'void': dom.type.void,
  '*': dom.type.any
}

const dtsUnion = (types) => {
  return dom.create.union(types)
}

const trimPara = (text) => {
  if (text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '')
  }
  return ''
}

const dtsNamedTypeReference = (namedTypeReference) => {
  return dom.create.namedTypeReference(namedTypeReference)
}

const fixType = (type, service) => {
  if (typeof type === 'string') {
    const parentStr = `${service.name}.`
    if(type.startsWith(parentStr)) {
      return type.replace(parentStr, '')
    }
    else if(type.includes(parentStr) && type.includes(`${service.memberOf}.`)) {
      const splitedParts = type.split(`${service.memberOf}.`)
      return `${splitedParts[splitedParts.length - 1]}`
    }
    else if(type.includes(".") && type.startsWith(`${service.memberOf}.`)){
      const splitedParts = type.split(".")
      return type.replace(`${splitedParts[0]}.`, '')
    }
    else if (type.includes(".")) {
      //todo:: cross referenced!
      console.log("corss referenced type ", type, " from ", `${service.memberOf}.${service.name}`)
      return dom.type.any
    }
  }
  return type
}

const dtsIntersection = (types) => {
  return dom.create.intersection(types)
}

const getDtsType = (type, options = {}, { service } = {}) => {
  if (typeof type === 'string') {
    if (builtInTypes[type])
      return builtInTypes[type]
    else
      return fixType(type, service)
  }
  else if (typeof type === 'object' && type.name) {
    if (type.name === 'Array') {
      return `${getDtsType(type.typeParams[0], undefined, { service })}[]`
    }
    else if (type.name === 'Promise') {
      return dtsNamedTypeReference(`Promise<${getDtsType(type.typeParams[0], undefined, { service })}>`)
    }
  }
  else if (Array.isArray(type) && type.length > 0) {
    if (options.intersection && options.union || !options.intersection && !options.union) {
      throw new Error(`Unable to convert type ${type} to type union or intersection. Options must include only one flag`)
    }

    const types = type.map(t => getDtsType(t, undefined, { service }))
    if (options.union) {
      return dtsUnion(types)
    } else if (options.intersection) {
      return dtsIntersection(types)
    }
    throw new Error(`Unable to convert type ${type} to valid dts type`)
  }

  throw new Error(`Unable to convert type ${type} to valid dts type`)
}


const dtsProperty = (name, type, { readonly = false, optional = false, jsDocComment, service } = {}) => {
  let declarationFlags = dom.DeclarationFlags.None
  declarationFlags = readonly ? declarationFlags |dom.DeclarationFlags.ReadOnly : declarationFlags
  declarationFlags = optional ? declarationFlags |dom.DeclarationFlags.Optional : declarationFlags

  const prop = dom.create.property(name, getDtsType(type, {union: true}, { service }), declarationFlags)
  prop.jsDocComment = trimPara(jsDocComment)

  return prop
}

const messageMemberToProperty = (member, service) => {
  const { name, type, optional, doc } = member
  return dtsProperty(name, type, { optional, jsDocComment: doc, service })
}

const dtsAlias = (name, type, {jsDocComment, typeParameters = []} = {}) => {
  const alias = dom.create.alias(name, type)

  alias.jsDocComment = trimPara(jsDocComment)
  alias.typeParameters = typeParameters

  return alias
}

const dtsObjectTypeAlias = (name, members, { jsDocComment, aliasTypeParameters } = {}) => {
  const objectType = dom.create.objectType(members)

  return dtsAlias(name, objectType, {jsDocComment, typeParameters: aliasTypeParameters})
}

const messageToType = (message, service) => {
  const jsDocComment = message.docs.summary
  const properties = message.members ? message.members.map(m => messageMemberToProperty(m, service)): []

  return dtsObjectTypeAlias(message.name, properties, { jsDocComment })
}

const dtsParameter = (name, type, {spread = false, optional = false, jsDocComment, service } = {}) => {
  let parameterFlags = dom.ParameterFlags.None
  parameterFlags = optional ? dom.ParameterFlags.Optional: parameterFlags
  parameterFlags = spread ? dom.ParameterFlags.Rest: parameterFlags
  const paramType = spread ? { name: 'Array', typeParams: [ type ] }: type
  const targetType = getDtsType(paramType, { spread, union: true }, { service })
  const parameter = dom.create.parameter(name, targetType, parameterFlags)
  parameter.jsDocComment = jsDocComment

  return parameter
}


const operationParamToParameters = (param, service) => {
  const { name, type, optional, doc, spread } = param
  // console.log("SERVICE NAME ", service.name)
  return dtsParameter(name, type, { spread, optional, jsDocComment: doc, service })
}

const dtsConst = (property, { jsDocComment, service }) => {
  const targetType = getDtsType(property.type, {union: true}, { service })
  
  const cnt = dom.create.const(property.name, targetType)
  cnt.jsDocComment = trimPara(jsDocComment)
  return cnt
}

const dtsFunction = (name, parameters, returnType, { service, jsDocComment, typeParameters = [] } = {}) => {
  const targetRetType = getDtsType(returnType, {intersection: true}, { service })
  const func = dom.create.function(
    name,
    parameters,
    targetRetType
  )

  func.jsDocComment = trimPara(jsDocComment)
  func.typeParameters = typeParameters

  return func
}

const dtsInterface = (name, { members = [], baseTypes = [], jsDocComment }) => {
  if(!isEmpty_(baseTypes)) debugger
  const intf = dom.create.interface(name)
  intf.members = members
  intf.baseTypes = baseTypes
  intf.jsDocComment = trimPara(jsDocComment)
  return intf
}

const dtsMethod = (name, parameters, returnType, { jsDocComment, service }) => {
  const method = dom.create.method(
    name,
    parameters,
    getDtsType(returnType, {intersection: true}, { service }))

  method.jsDocComment = trimPara(jsDocComment)

  return method
}



const operationToMethod = (
  service,
  operation,
  { documentationGenerator }
) => {
  const { name, params, ret, docs } = operation
  const parameters = params.map(p => operationParamToParameters(p, service))
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: service,
    member: name,
    eventType: operation.extra && operation.extra.eventType ? operation.extra.eventType : null,
  })

  return dtsMethod(name, parameters, ret.type, { jsDocComment, service })
}

const propertyToProperty = (
  service,
  property,
  { documentationGenerator }
) => {
  const readonly = property.get && !property.set
  const jsDocComment = documentationGenerator({
    summary: property.docs.summary,
    service: service.name,
    member: property.name
  })

  return dtsProperty(property.name, property.type, { readonly, jsDocComment, service })
}

const subServiceToInterface = (service, { documentationGenerator }) => {
  if(service.name === "Authentication") debugger
  const { properties = [], operations = [] }  = service
  const propertyMembers = properties.map(prop => propertyToProperty(service, prop, { documentationGenerator }))
  const functionMembers = operations.map(oper => operationToMethod(service, oper, { documentationGenerator }))
  const baseTypes = service.mixes.map(mix => fixType(mix, service))
  const members = propertyMembers.concat(functionMembers)
  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: service.name
  })

  return dtsInterface(service.name, { members, baseTypes, jsDocComment })
}

const dtsNamespace = (name, {jsDocComment} = {}) => {
  const namespace = dom.create.namespace(name)

  namespace.jsDocComment = trimPara(jsDocComment)

  return namespace
}

const subServiceToNamespace = (service, { documentationGenerator }) => {
  const baseTypes = service.mixes.map(mix => fixType(mix, service))
  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: service.name
  })

  const namespace_ = dtsNamespace(service.name, { baseTypes, jsDocComment })
  const { messages = [], callbacks = [] }  = service
  const members = messages
    .map(msg => messageToType(msg, service))
    .concat(
      callbacks.map(oper => callbackToFunctionType(oper, service, { documentationGenerator }))
    )
    .concat(
      Object.values(service.services)
        .map(sub => {
          return subServiceToInterface(sub, { documentationGenerator })})
    )
  
  namespace_.members = members
  return namespace_
}

const dtsModule = (name, {members = [], jsDocComment}) => {
  const module = dom.create.module(name)
  module.members = members
  module.jsDocComment = trimPara(jsDocComment)
  return module
}

const propertyToConst = (service, property, { documentationGenerator }) => {
  const jsDocComment = documentationGenerator({
    summary: property.docs.summary,
    service: service.name,
    member: property.name
  })
  return dtsConst(property, { jsDocComment, service })
}

const operationToFunction = (
  service,
  operation,
  { documentationGenerator }
) => {
  const { name, params, ret, docs } = operation
  const parameters = params.map(p => operationParamToParameters(p, service))
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: service.name,
    member: name
  })
  return dtsFunction(name, parameters, ret.type, { jsDocComment, service })
}

const isEmptyInterface = (service) => isEmpty_(service.properties) && isEmpty_(service.operations)
const isEmptyNamespace = (service) => isEmpty_(service.services) && isEmpty_(service.messages) && isEmpty_(service.callbacks)

const dtsFunctionType = (parameters, returnType, {typeParameters = [], service } = {}) => {
  const funcType = dom.create.functionType(
    parameters,
    getDtsType(returnType, {union: true}, { service }))

  funcType.typeParameters = typeParameters

  return funcType
}

const dtsFunctionTypeAlias = (name, parameters, returnType, {jsDocComment, aliasTypeParameters, funcTypeParameters, service } = {}) => {
  const functionType = dtsFunctionType(parameters, returnType, {typeParameters: funcTypeParameters, service})
  const callbackName = name

  return dtsAlias(callbackName, functionType, {jsDocComment, typeParameters: aliasTypeParameters})
}

const callbackToFunctionType = (callback, service) => {
  const { name, params, ret, docs } = callback
  const parameters = params.map(p => operationParamToParameters(p, service))
  const jsDocComment = docs.summary

  return dtsFunctionTypeAlias(name, parameters, ret.type, { jsDocComment, service })
}


const createModule = (service, { documentationGenerator }) => {
  if(service.name === "wix-members") debugger
  const { properties = [], operations = [], messages = [], callbacks = [], services: subServices = {} }  = service
  const constMembers = properties.map(prop => propertyToConst(service, prop, { documentationGenerator }))
  const functionMembers = operations.map(oper => operationToFunction(service, oper, { documentationGenerator }))
  const typesMembers = messages.map(msg => messageToType(msg, service))
  const handlersMembers = callbacks.map(msg => callbackToFunctionType(msg, service))
  const interfacesMembers = Object.values(subServices)
    .filter(s => ! isEmptyInterface(s))
    .map(inter => subServiceToInterface(inter,  { documentationGenerator }))

  const namespacesMembers  = Object.values(subServices)
    .filter(s => ! isEmptyNamespace(s))
    .map(n => subServiceToNamespace(n,  { documentationGenerator }))

  const members = constMembers
    .concat(functionMembers)
    .concat(typesMembers)
    .concat(handlersMembers)
    .concat(interfacesMembers)
    .concat(namespacesMembers)

  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: service.name
  })
  return dtsModule(service.name, { members, jsDocComment })
}

function handleModule(
  service,
  { documentationGenerator } = {}
) {
  const { name } = service

  const module = createModule(service, { documentationGenerator })
  const content = dom.emit(module)
  return {
    name,
    content
  }
}

function dts(
  services,
  { run$wFixer = false, summaryTemplate, ignoredModules = [], ignoredNamespaces = [] } = {}
) {
  let documentationGenerator = ({summary}) => summary

  if (summaryTemplate) {
    documentationGenerator = values => {
      return template_(summaryTemplate)({model: values})
    }
  }

  const modulesMap = {}

  while(services.length) {
    const s = services.shift()
    if(!s.memberOf) {
      modulesMap[s.name] = Object.assign({ services: {} }, s)
    }
    else if(!s.memberOf.includes(".")) {
      if(modulesMap[s.memberOf]) {
        modulesMap[s.memberOf].services[s.name] = Object.assign({ services: {} }, s)
      }
      else {
        services.push(s)
      }
    }
    else {
      const setPath = `${s.memberOf.split(".").join(".services.")}.services`
      if (has_(modulesMap, setPath)) {
        set_(modulesMap, `${setPath}.${s.name}`, Object.assign({ services: {} }, s))
      }
      else {
        services.push(s)
      }
    }
  }

  const wixModuleFiles = []
  Object.keys(modulesMap).forEach( moduleKey => {
    wixModuleFiles.push(handleModule(modulesMap[moduleKey], { documentationGenerator }))
  })

  ignoredModules.forEach(module => delete modules[module])
  return wixModuleFiles
}

module.exports = dts
