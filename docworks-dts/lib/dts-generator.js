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
      return dom.create.namedTypeReference(`Promise<${getDtsType(type.typeParams[0])}>`)
    }
  }
  else if (Array.isArray(type) && type.length > 0) {
    if (options.intersection && options.union || !options.intersection && !options.union) {
      throw new Error(`Unable to convert type ${type} to type union or intersection. Options must include only one flag`)
    }

    const types = type.map(t => getDtsType(t))
    if (options.union) {
      return dom.create.union(types)
    } else if (options.intersection) {
      return dom.create.intersection(types)
    }
    throw new Error(`Unable to convert type ${type} to valid dts type`)
  }

  throw new Error(`Unable to convert type ${type} to valid dts type`)
}

function convertTreeToString(tree) {
  return Object.keys(tree).map(key => dom.emit(tree[key])).join('')
}

function dtsAlias(name, type, {jsDocComment}) {
  const alias = dom.create.alias(name, type)
  alias.jsDocComment = trimPara(jsDocComment)
  return alias
}

function dtsConst(property) {
  const cnt = dom.create.const(property.name, getDtsType(property.type, {union: true}))
  cnt.jsDocComment = trimPara(property.docs.summary)
  return cnt
}

function dtsFunction(name, params, returnType, {jsDocComment}) {
  const func = dom.create.function(
    name,
    params.map(param => {
      const parameterFlags = param.optional ? dom.ParameterFlags.Optional : dom.ParameterFlags.None
      const parameter = dom.create.parameter(param.name, getDtsType(param.type, {union: true}), parameterFlags)
      parameter.jsDocComment = trimPara(param.doc)
      return parameter
    }),
    getDtsType(returnType, {intersection: true}))
  func.jsDocComment = trimPara(jsDocComment)
  return func
}

function dtsFunctionType(params, returnType) {
  return dom.create.functionType(params.map(param => {
      const parameterFlags = param.optional ? dom.ParameterFlags.Optional : dom.ParameterFlags.None
      const parameter = dom.create.parameter(param.name, getDtsType(param.type, {union: true}), parameterFlags)
      parameter.jsDocComment = trimPara(param.doc)
      return parameter
    }),
    getDtsType(returnType, {intersection: true}))
}

function dtsInterface(name, {members = [], baseTypes = [], jsDocComment}) {
  const intf = dom.create.interface(name)
  intf.members = members
  intf.baseTypes = baseTypes
  intf.jsDocComment = trimPara(jsDocComment)
  return intf
}

function dtsMethod(name, params, returnType, {jsDocComment}) {
  const method = dom.create.method(
    name,
    params.map(param => {
      const parameterFlags = param.optional ? dom.ParameterFlags.Optional : dom.ParameterFlags.None
      const parameter = dom.create.parameter(param.name, getDtsType(param.type, {union: true}), parameterFlags)
      parameter.jsDocComment = trimPara(param.doc)
      return parameter
    }),
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

function dtsNamespace(name) {
  return dom.create.namespace(validServiceName(name))
}


function dtsObjectType(members) {
  return dom.create.objectType(members.map(member => {
    const declarationFlags = member.optional ? dom.DeclarationFlags.Optional : dom.DeclarationFlags.None
    const prop = dom.create.property(member.name, getDtsType(member.type, {union: true}), declarationFlags)
    prop.jsDocComment = trimPara(member.doc)
    return prop
  }))
}

function dtsProperty(property) {
  const declarationFlags = property.get && !property.set ? dom.DeclarationFlags.ReadOnly : dom.DeclarationFlags.None
  const prop = dom.create.property(property.name, getDtsType(property.type, {union: true}), declarationFlags)
  prop.jsDocComment = trimPara(property.docs.summary)
  return prop
}

module.exports = {
  convertTreeToString,
  dtsAlias,
  dtsConst,
  dtsFunction,
  dtsFunctionType,
  dtsInterface,
  dtsMethod,
  dtsModule,
  dtsNamespace,
  dtsProperty,
  dtsObjectType,
  getDtsType,
}
