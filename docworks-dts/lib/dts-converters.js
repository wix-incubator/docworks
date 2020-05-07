const { validServiceName } = require('./utils')
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

const fullServiceName = service =>
  service.memberOf ? `${service.memberOf}.${service.name}` : service.name

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
    service: fullServiceName(service),
    extra: service.extra
  })

  return dtsInterface(service.name, { members, baseTypes, jsDocComment })
}

function convertServiceToModule(service, { documentationGenerator }) {
  const properties = service.properties.map(property =>
    convertPropertyToConst(service, property, { documentationGenerator })
  )
  const operations = service.operations.map(operation =>
    convertOperationToFunction(service, operation, { documentationGenerator })
  )
  const members = properties.concat(operations)
  const jsDocComment = documentationGenerator({
    summary: service.docs.summary,
    service: fullServiceName(service),
    extra: service.extra
  })

  return dtsModule(service.name, { members, jsDocComment })
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
    member: property.name,
    extra: property.extra
  })

  return dtsProperty(property.name, property.type, { readonly, jsDocComment })
}

function convertOperationParamToParameters(param) {
  const { name, type, optional, doc } = param

  return dtsParameter(name, type, { optional, jsDocComment: doc })
}

function convertOperationToMethod(
  service,
  operation,
  { documentationGenerator }
) {
  const { name, params, ret, docs } = operation
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: fullServiceName(service),
    member: name,
    extra: operation.extra
  })

  return dtsMethod(name, parameters, ret.type, { jsDocComment })
}

function convertPropertyToConst(service, property, { documentationGenerator }) {
  const jsDocComment = documentationGenerator({
    summary: property.docs.summary,
    service: fullServiceName(service),
    member: property.name,
    extra: property.extra
  })
  return dtsConst(property, { jsDocComment })
}

function convertOperationToFunction(
  service,
  operation,
  { documentationGenerator }
) {
  const { name, params, ret, docs } = operation
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = documentationGenerator({
    summary: docs.summary,
    service: fullServiceName(service),
    member: name,
    extra: operation.extra
  })

  return dtsFunction(name, parameters, ret.type, { jsDocComment })
}

function convertMessageMemberToProperty(member) {
  const { name, type, optional, doc } = member
  return dtsProperty(name, type, { optional, jsDocComment: doc })
}

function convertMessageToObjectType(message) {
  const jsDocComment = message.docs.summary
  const properties = message.members.map(convertMessageMemberToProperty)

  return dtsObjectTypeAlias(message.name, properties, { jsDocComment })
}

function convertCallbackToFunctionType(callback) {
  const { name, params, ret, docs } = callback
  const parameters = params.map(convertOperationParamToParameters)
  const jsDocComment = docs.summary

  return dtsFunctionTypeAlias(name, parameters, ret.type, { jsDocComment })
}

module.exports = {
  convertCallbackToType: convertCallbackToFunctionType,
  convertMessageToType: convertMessageToObjectType,
  convertOperationParamToParameters,
  convertOperationToFunction,
  convertServiceToInterface,
  convertServiceToModule
}
