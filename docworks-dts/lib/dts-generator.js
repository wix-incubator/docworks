const dom = require('dts-dom')
const {validServiceName} = require('./utils')

const builtInTypes = {
  'string': dom.type.string,
  'boolean': dom.type.boolean,
  'number': dom.type.number,
  'Object': dom.type.any,
  'void': dom.type.void,
  '*': dom.type.any
}

function trimPara(text) {
  if (text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '')
  }
  return ''
}

function getDtsType(type, options = {}) {
  if (typeof type === 'string') {
    if (builtInTypes[type])
      return builtInTypes[type]
    else
      return validServiceName(type)
  }
  else if (typeof type === 'object' && type.name) {
    if (type.name === 'Array') {
      return `${getDtsType(type.typeParams[0])}[]`
    }
    else if (type.name === 'Promise') {
      return dtsNamedTypeReference(`Promise<${getDtsType(type.typeParams[0])}>`)
    }
  }
  else if (Array.isArray(type) && type.length > 0) {
    if(isNewDocsTypesDefinition(type)){
      const createdDocsNamedType = getDtsFromDocsType(type)
      return dtsNamedTypeReference(createdDocsNamedType)
    }

    if (options.intersection && options.union || !options.intersection && !options.union) {
      throw new Error(`Unable to convert type ${type} to type union or intersection. Options must include only one flag`)
    }

    const types = type.map(t => getDtsType(t))
    if (options.union) {
      return dtsUnion(types)
    } else if (options.intersection) {
      return dtsIntersection(types)
    }
    throw new Error(`Unable to convert type ${type} to valid dts type`)
  }

  throw new Error(`Unable to convert type ${type} to valid dts type`)
}

// Docs Type Definition: https://github.com/wix-private/p13n/blob/master/wixplorer/wix-docs-server/proto/docs/README.md
function isNewDocsTypesDefinition(type) {
  return type.some(currentType => currentType.nativeType || currentType.complexType || currentType.referenceType)
}

function getDtsFromDocsType(docsTypes) {
  if(isUnionType(docsTypes)){
    return docsTypes.map(t => getDtsFromDocsType([t])).join(' | ')
  }
  else{
    const docsType = docsTypes[0]
    if(docsType.nativeType || docsType.referenceType){
      return validServiceName(docsType.nativeType || docsType.referenceType)
    }
    else if(docsType.complexType){
      let typeName = getDtsFromDocsType([docsType.complexType])
      if(isKeyValueType(typeName)){
        const { key, value } = getKeyValueDefinitions(docsType.complexType.typeParams)
        return `${typeName}<${getDtsFromDocsType(key)}, ${getDtsFromDocsType(value)}>`
      }
      else{
        return `${typeName}<${getDtsFromDocsType(docsType.complexType.typeParams)}>`
      }
    }
  }
}

// Array of more one value defines for us a union type.
function isUnionType(docsTypes) {
  return docsTypes.length > 1
}

// Supported key value types: Record/Map.
function isKeyValueType(typeName) {
  return typeName === 'Record' || typeName === 'Map'
}

// The key is the first type of the array, or by key property.
function getKeyValueDefinitions(typeParams) {
  const typeParamsByKeyIfExists = typeParams.sort((typeParamA, typeParamB) => {
    if(typeParamA.key === true){
      return -1
    }
    else if(typeParamB.key === true){
      return 1
    }
    return 0
  })

  const key = typeParamsByKeyIfExists
  const value = typeParamsByKeyIfExists.splice(1)

  return { key, value }
}

function convertTreeToString(tree) {
  return Object.keys(tree).map(key => dom.emit(tree[key])).join('')
}

function getTripleSlashDirectivesString(tripleSlashDirectives = []){
  return dom.emit('', {tripleSlashDirectives})
}

function dtsAlias(name, type, {jsDocComment, typeParameters = []} = {}) {
  const alias = dom.create.alias(name, type)

  alias.jsDocComment = trimPara(jsDocComment)
  alias.typeParameters = typeParameters

  return alias
}

function dtsConst(property, {jsDocComment}) {
  const cnt = dom.create.const(property.name, getDtsType(property.type, {union: true}))
  cnt.jsDocComment = trimPara(jsDocComment)
  return cnt
}

function dtsEnum(enumName, values, {jsDocComment}) {
  const enm = dom.create.enum(enumName)
  enm.members = values.map(val => dom.create.enumValue(val, val))
  enm.jsDocComment = trimPara(jsDocComment)
  return enm
}

function dtsFunction(name, parameters, returnType, {jsDocComment, typeParameters = []} = {}) {
  const func = dom.create.function(
    name,
    parameters,
    getDtsType(returnType, {intersection: true}))

  func.jsDocComment = trimPara(jsDocComment)
  func.typeParameters = typeParameters

  return func
}

function dtsFunctionType(parameters, returnType, {typeParameters = []} = {}) {
  const funcType = dom.create.functionType(
    parameters,
    getDtsType(returnType, {union: true}))

  funcType.typeParameters = typeParameters

  return funcType
}

function dtsFunctionTypeAlias(name, parameters, returnType, {jsDocComment, aliasTypeParameters, funcTypeParameters} = {}) {
  const functionType = dtsFunctionType(parameters, returnType, {typeParameters: funcTypeParameters})
  const callbackName = validServiceName(name)

  return dtsAlias(callbackName, functionType, {jsDocComment, typeParameters: aliasTypeParameters})
}

function dtsInterface(name, {members = [], baseTypes = [], jsDocComment}) {
  const intf = dom.create.interface(name)
  intf.members = members
  intf.baseTypes = baseTypes
  intf.jsDocComment = trimPara(jsDocComment)
  return intf
}

function dtsIntersection(types) {
  return dom.create.intersection(types)
}

function dtsMethod(name, parameters, returnType, {jsDocComment}) {
  const method = dom.create.method(
    name,
    parameters,
    getDtsType(returnType, {intersection: true}))

  method.jsDocComment = trimPara(jsDocComment)

  return method
}

function dtsModule(name, {members = [], jsDocComment}) {
  const module = dom.create.module(name)

  module.members = members
  module.jsDocComment = trimPara(jsDocComment)

  return module
}

function dtsNamespace(name, {jsDocComment} = {}) {
  const namespace = dom.create.namespace(validServiceName(name))

  namespace.jsDocComment = trimPara(jsDocComment)

  return namespace
}

function dtsNamedTypeReference(namedTypeReference, typeArguments) {
  let namedTypeReferenceCreated = dom.create.namedTypeReference(namedTypeReference)
  if(typeArguments){
    namedTypeReference.typeArguments = typeArguments
  }
  return namedTypeReferenceCreated
}

function dtsObjectType(members) {
  return dom.create.objectType(members)
}

function dtsObjectTypeAlias(name, members, {jsDocComment, aliasTypeParameters} = {}) {
  const objectType = dtsObjectType(members)
  const messageName = validServiceName(name)

  return dtsAlias(messageName, objectType, {jsDocComment, typeParameters: aliasTypeParameters})
}

function dtsParameter(name, type, {spread = false, optional = false, jsDocComment} = {}) {
  let parameterFlags = dom.ParameterFlags.None
  parameterFlags = optional ? dom.ParameterFlags.Optional: parameterFlags
  parameterFlags = spread ? dom.ParameterFlags.Rest: parameterFlags
  const paramType = spread ? { name: 'Array', typeParams: [ type ] }: type

  const parameter = dom.create.parameter(name, getDtsType(paramType, { union: true }), parameterFlags)
  parameter.jsDocComment = trimPara(jsDocComment)

  return parameter
}

function dtsProperty(name, type, {readonly = false, optional = false, jsDocComment} = {}) {
  let declarationFlags = dom.DeclarationFlags.None
  declarationFlags = readonly ? declarationFlags |dom.DeclarationFlags.ReadOnly : declarationFlags
  declarationFlags = optional ? declarationFlags |dom.DeclarationFlags.Optional : declarationFlags

  const prop = dom.create.property(name, getDtsType(type, {union: true}), declarationFlags)
  prop.jsDocComment = trimPara(jsDocComment)

  return prop
}

function dtsTypeParameter(name, baseType) {
  return dom.create.typeParameter(name, baseType)
}

function dtsTripleSlashReferencePathDirective(path) {
  return dom.create.tripleSlashReferencePathDirective(path)
}

function dtsUnion(types) {
  return dom.create.union(types)
}

module.exports = {
  convertTreeToString,
  dtsEnum,
  dtsAlias,
  dtsConst,
  dtsFunction,
  dtsFunctionTypeAlias,
  dtsInterface,
  dtsIntersection,
  dtsMethod,
  dtsModule,
  dtsNamespace,
  dtsNamedTypeReference,
  dtsParameter,
  dtsProperty,
  dtsObjectTypeAlias,
  dtsTypeParameter,
  dtsTripleSlashReferencePathDirective,
  getDtsType,
  getTripleSlashDirectivesString
}
