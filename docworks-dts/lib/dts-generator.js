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
  if (type === undefined) return false

  // New Service object Type definition parsing support.
  if(type && type.nativeType){
    return validServiceName(type.nativeType)
  }

  if(type && type.referenceType){
    console.log("before recursive")
    return getDtsType(global.customComplexTypesMap[type.referenceType])
  }

  if(type && type.complexType){
    if(type.complexType.typeParams.length > 1){
      const unionType = `${type.complexType.nativeType}<${type.complexType.typeParams.reduce(
        (acc, curr, index) => acc += (index === type.complexType.typeParams.length - 1) ? `${getDtsType(curr)}` : `${getDtsType(curr)} | `, 
        ''
      )}>`

      return unionType
    }
    else{
      return `${type.complexType.nativeType}<${getDtsType(type.complexType.typeParams[0])}>`
    }
  }
  
  // Legacy Type property parsing support
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

function convertTreeToString(tree) {
  return Object.keys(tree).map(key => {
    console.log("conevrting tree", tree[key].name)
    const trreName = tree[key].name;
    const bugsList = ['wix_dev_backend', 'wix_echo_backend']
    if (bugsList.some(b => b === trreName)) return ""
    return dom.emit(tree[key])}).join('')
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

function dtsNamedTypeReference(namedTypeReference) {
  return dom.create.namedTypeReference(namedTypeReference)
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

  const parameter = dom.create.parameter(name, getDtsType(paramType, { spread, union: true }), parameterFlags)
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
