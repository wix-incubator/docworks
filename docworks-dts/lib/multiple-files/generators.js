const dom = require('dts-dom')
const BASE_TYPES = {
	string: dom.type.string,
	boolean: dom.type.boolean,
	number: dom.type.number,
	Object: dom.type.any,
	void: dom.type.void,
	'*': dom.type.any
}
const trimParam = text => {
	if (text) return text.trim().replace(/<(?:.|\n)*?>/gm, '')
	return ''
}

const dtsUnion = types => {
	return dom.create.union(types)
}

const dtsIntersection = types => {
	return dom.create.intersection(types)
}

const dtsEnum = (enumName, values, { jsDocComment }) => {
	const enm = dom.create.enum(enumName)
	enm.members = values.map(val => dom.create.enumValue(val, val))
	enm.jsDocComment = trimParam(jsDocComment)

	return enm
}

const getPropertyFlags = ({ readonly, optional }) => {
	if (readonly) return dom.DeclarationFlags.ReadOnly
	if (optional) return dom.DeclarationFlags.Optional
	return dom.DeclarationFlags.None
}

const dtsProperty = (
	name,
	type,
	{ readonly = false, optional = false, jsDocComment } = {}
) => {
	const flags = getPropertyFlags({ readonly, optional })
	const prop = dom.create.property(name, type, flags)
	prop.jsDocComment = trimParam(jsDocComment)

	return prop
}

const dtsAlias = (name, type, { jsDocComment, typeParameters = [] } = {}) => {
	const alias = dom.create.alias(name, type)
	alias.jsDocComment = trimParam(jsDocComment)
	alias.typeParameters = typeParameters

	return alias
}

const dtsObjectTypeAlias = (
	name,
	members,
	{ jsDocComment, aliasTypeParameters } = {}
) => {
	const objectType = dom.create.objectType(members)

	return dtsAlias(name, objectType, {
		jsDocComment,
		typeParameters: aliasTypeParameters
	})
}

const dtsFunctionType = (
	parameters,
	returnType,
	{ typeParameters = [] } = {}
) => {
	const funcType = dom.create.functionType(parameters, returnType)
	funcType.typeParameters = typeParameters

	return funcType
}

const dtsFunctionTypeAlias = (
	name,
	parameters,
	returnType,
	{ jsDocComment, aliasTypeParameters, funcTypeParameters } = {}
) => {
	const functionType = dtsFunctionType(parameters, returnType, {
		typeParameters: funcTypeParameters
	})
	const callbackName = name

	return dtsAlias(callbackName, functionType, {
		jsDocComment,
		typeParameters: aliasTypeParameters
	})
}

const getParameterFlags = ({ spread, optional }) => {
	if (spread) return dom.ParameterFlags.Rest
	if (optional) return dom.ParameterFlags.Optional
	return dom.ParameterFlags.None
}
const dtsParameter = (
	name,
	type,
	{ spread = false, optional = false, jsDocComment } = {}
) => {
	const flags = getParameterFlags({ spread, optional })
	const parameter = dom.create.parameter(name, type, flags)
	parameter.jsDocComment = trimParam(jsDocComment)

	return parameter
}

const dtsConst = (property, { jsDocComment }) => {
	const cnt = dom.create.const(property.name, property.type)
	cnt.jsDocComment = trimParam(jsDocComment)

	return cnt
}

const dtsFunction = (
	name,
	parameters,
	returnType,
	{ jsDocComment, typeParameters = [] } = {}
) => {
	const func = dom.create.function(name, parameters, returnType)
	func.jsDocComment = trimParam(jsDocComment)
	func.typeParameters = typeParameters

	return func
}

const dtsInterface = (name, { members = [], baseTypes = [], jsDocComment }) => {
	const intf = dom.create.interface(name)
	intf.members = members
	intf.baseTypes = baseTypes
	intf.jsDocComment = trimParam(jsDocComment)

	return intf
}

const dtsMethod = (name, parameters, returnType, { jsDocComment }) => {
	const method = dom.create.method(name, parameters, returnType)
	method.jsDocComment = trimParam(jsDocComment)

	return method
}

const dtsNamespace = (name, { jsDocComment } = {}) => {
	const namespace = dom.create.namespace(name)
	namespace.jsDocComment = trimParam(jsDocComment)

	return namespace
}

const dtsModule = (name, { members = [], jsDocComment }) => {
	const module = dom.create.module(name)
	module.members = members
	module.jsDocComment = trimParam(jsDocComment)

	return module
}

const dtsNamedTypeReference = namedTypeReference => {
	return dom.create.namedTypeReference(namedTypeReference)
}

const dtsImportDefault = (moduleName, from) => {
	return dom.create.importDefault(moduleName, from)
}

const dtsWrapNamespaceWithGlobal = (namespaceName, declaration) => {
	const currentNamespaceStart = `declare namespace ${namespaceName}`
	if (declaration.includes(currentNamespaceStart)) {
		declaration = declaration.replace(
			currentNamespaceStart,
			`namespace ${namespaceName}`
		)
	}
	return `declare global {\n${declaration}\n}`
}


const dtsTripleSlashReference = (name) => {
  return `/// <reference path='./${name}.d.ts' />`
}
const emit = (...args) => dom.emit(...args)

module.exports = {
	emit,
	BASE_TYPES,
	dtsEnum,
	dtsUnion,
	dtsConst,
	dtsAlias,
	dtsMethod,
	dtsModule,
	dtsFunction,
	dtsParameter,
	dtsProperty,
	dtsInterface,
	dtsNamespace,
	dtsIntersection,
	dtsImportDefault,
	dtsObjectTypeAlias,
	dtsFunctionTypeAlias,
	dtsNamedTypeReference,
  dtsTripleSlashReference,
	dtsWrapNamespaceWithGlobal
}
