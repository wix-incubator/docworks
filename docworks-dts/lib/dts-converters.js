const {validServiceName} = require('./utils')
const {
  dtsConst,
  dtsFunction,
  dtsFunctionTypeAlias,
  dtsInterface,
  dtsMethod,
  dtsModule,
  dtsParameter,
  dtsProperty,
  dtsObjectTypeAlias
} = require('./dts-generator')

function convertServiceToInterface(service) {
  const properties = service.properties.map(convertPropertyToProperty)
  const operations = service.operations.map(convertOperationToMethod)
  const members = properties.concat(operations)
  const baseTypes = service.mixes.map(validServiceName)
  const jsDocComment = service.docs.summary

  return dtsInterface(service.name, {members, baseTypes, jsDocComment})
}

function convertServiceToModule(service) {
  const properties = service.properties.map(dtsConst)
  const operations = service.operations.map(convertOperationToFunction)
  const members = properties.concat(operations)
  const jsDocComment = service.docs.summary

  return dtsModule(service.name, {members, jsDocComment})
}

function convertPropertyToProperty(property) {
  const readonly = property.get && !property.set
  const jsDocComment = property.docs.summary

  return dtsProperty(property.name, property.type, {readonly, jsDocComment})
}

function convertOperationParamToParameters(param) {
  const {name, type, optional, doc} = param

  return dtsParameter(name, type, {optional, jsDocComment: doc})
}

function convertOperationToMethod(operation) {
  const {name, params, ret, docs} = operation
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = docs.summary

  return dtsMethod(name, parameters, ret.type, {jsDocComment})
}

function convertOperationToFunction(operation) {
  const {name, params, ret, docs} = operation
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = docs.summary

  return dtsFunction(name, parameters, ret.type, {jsDocComment})
}

function convertMessageMemberToProperty(member) {
  const {name, type, optional, doc} = member
  return dtsProperty(name, type, {optional, jsDocComment: doc})
}

function convertMessageToObjectType(message) {
  const jsDocComment = message.docs.summary
  const properties = message.members.map(convertMessageMemberToProperty)

  return dtsObjectTypeAlias(message.name, properties, {jsDocComment})
}

function convertCallbackToFunctionType(callback) {
  const {name, params, ret, docs} = callback
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = docs.summary

  return dtsFunctionTypeAlias(name, parameters, ret.type, {jsDocComment})
}

module.exports = {
  convertCallbackToType: convertCallbackToFunctionType,
  convertMessageToType: convertMessageToObjectType,
  convertOperationParamToParameters,
  convertOperationToFunction,
  convertServiceToInterface,
  convertServiceToModule
}
