const isEmpty_ = require('lodash/isEmpty')
const { resolveType } = require('./typeResolver')
const {
	dtsEnum,
	dtsConst,
	dtsMethod,
	dtsFunction,
	dtsParameter,
	dtsProperty,
	dtsInterface,
	dtsNamespace,
	dtsObjectTypeAlias,
	dtsFunctionTypeAlias
} = require('./generators')

const getDocumentationGenerator = require('./providers/documentationGenerator')
const { getServiceSummary } = require('./serviceUtils')

const { SUB_SERVICES_KEY } = require('./constants')

const getServiceDocsName = ({ name, memberOf }) =>
	memberOf ? `${memberOf}.${name}` : name

const docworksPropertyToDtsConst = (property, service) => {
	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: property.docs.summary,
		service: getServiceDocsName(service),
		member: property.name
	})
	property.type = resolveType(property.type, service, { union: true })
	return dtsConst(property, { jsDocComment, service })
}

const docworksOperationParamToDtsParameters = (param, service) => {
	const { name, type, optional, doc, spread } = param
	const paramType = spread ? { name: 'Array', typeParams: [type] } : type
	const targetType = resolveType(paramType, service, { spread, union: true })
	return dtsParameter(name, targetType, {
		spread,
		optional,
		jsDocComment: doc,
		service
	})
}

const docworksOperationToDtsFunction = (operation, service) => {
	const {
		name,
		params,
		ret: { type: returnType } = {},
		docs: { summary } = {}
	} = operation
	const targetReturnType = resolveType(returnType, service, {
		intersection: true
	})
	const documentationGenerator = getDocumentationGenerator()
	const parameters = params.map(p =>
		docworksOperationParamToDtsParameters(p, service)
	)
	const jsDocComment = documentationGenerator({
		summary: summary,
		service: getServiceDocsName(service),
		member: name
	})

	return dtsFunction(name, parameters, targetReturnType, {
		jsDocComment,
		service
	})
}

const docworksMessageMemberToDtsProperty = (member, service) => {
	const { name, type, optional, doc: jsDocComment } = member
	const resolvedType = resolveType(type, service, { union: true })
	return dtsProperty(name, resolvedType, { optional, jsDocComment, service })
}

const docworksMessageToDtsType = (message, service) => {
	const {
		name,
		members = [],
		enum: messageEnum,
		docs: { summary: jsDocComment } = {}
	} = message
	if (!isEmpty_(messageEnum)) {
		return dtsEnum(name, messageEnum, { jsDocComment })
	} else {
		const properties = members.map(member =>
			docworksMessageMemberToDtsProperty(member, service)
		)
		return dtsObjectTypeAlias(name, properties, { jsDocComment })
	}
}

const docworksCallbackToDtsFunctionType = (callback, service) => {
	const {
		name,
		params,
		ret: { type: returnType } = {},
		docs: { summary: jsDocComment } = {}
	} = callback
	const parameters = params.map(param =>
		docworksOperationParamToDtsParameters(param, service)
	)
	const resolvedReturnType = resolveType(returnType, service, { union: true })
	return dtsFunctionTypeAlias(name, parameters, resolvedReturnType, {
		jsDocComment,
		service
	})
}

const docworksPropertyToDtsProperty = (property, service) => {
	const { name, type, docs: { summary } = {} } = property
	const readonly = property.get && !property.set
	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: summary,
		service: getServiceDocsName(service),
		member: name
	})
	const resolvedType = resolveType(type, service, { union: true })
	return dtsProperty(name, resolvedType, { readonly, jsDocComment, service })
}

const getOperationEventType = operation =>
	operation.extra && operation.extra.eventType
		? operation.extra.eventType
		: null

const docworksOperationToDtsMethod = (operation, service) => {
	const {
		name,
		params,
		ret: { type: returnType } = {},
		docs: { summary } = {}
	} = operation
	const parameters = params.map(p =>
		docworksOperationParamToDtsParameters(p, service)
	)
	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: summary,
		service: getServiceDocsName(service),
		member: name,
		eventType: getOperationEventType(operation)
	})
	const targetReturnType = resolveType(returnType, service, {
		intersection: true
	})
	return dtsMethod(name, parameters, targetReturnType, {
		jsDocComment,
		service
	})
}

const docworksSubServiceToDtsInterface = service => {
	const { name, properties = [], operations = [] } = service
	const propertyMembers = properties.map(property =>
		docworksPropertyToDtsProperty(property, service)
	)
	const functionMembers = operations.map(operation =>
		docworksOperationToDtsMethod(operation, service)
	)
	const members = propertyMembers.concat(functionMembers)
	const baseTypes = docworksMixesToDtsBaseType(service)

	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: getServiceSummary(service),
		service: getServiceDocsName(service)
	})
	return dtsInterface(name, { members, baseTypes, jsDocComment })
}

const docworksServiceToDtsNamespace = service => {
	const baseTypes = docworksMixesToDtsBaseType(service)
	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: getServiceSummary(service),
		service: getServiceDocsName(service)
	})

	const tragetNamespace = dtsNamespace(service.name, {
		baseTypes,
		jsDocComment
	})

	const {
		messages = [],
		callbacks = [],
		[SUB_SERVICES_KEY]: subServices = {}
	} = service

	const typesMembers = messages.map(msg =>
		docworksMessageToDtsType(msg, service)
	)
	const functionMembers = callbacks.map(oper =>
		docworksCallbackToDtsFunctionType(oper, service)
	)
	const interfacesMembers = Object.values(subServices).map(
		docworksSubServiceToDtsInterface
	)

	tragetNamespace.members = [
		...typesMembers,
		...functionMembers,
		...interfacesMembers
	]

	return tragetNamespace
}

const hasSubServices = service =>
	Object.values(service[SUB_SERVICES_KEY]).length > 0

const docworksSubServiceToDtsNamespace = service => {
	if (!hasSubServices(service)) {
		return docworksServiceToDtsNamespace(service)
	}
	const parentNamespace = docworksServiceToDtsNamespace(service)
	Object.values(service[SUB_SERVICES_KEY]).forEach(subService => {
		parentNamespace.members = parentNamespace.members.concat(
			docworksSubServiceToDtsNamespace(subService)
		)
	})
	return parentNamespace
}

const docworksMixesToDtsBaseType = service => {
	return service.mixes.map(mix => resolveType(mix, service))
}

module.exports = {
	docworksMessageToDtsType,
	docworksMixesToDtsBaseType,
	docworksPropertyToDtsConst,
	docworksOperationToDtsFunction,
	docworksCallbackToDtsFunctionType,
	docworksSubServiceToDtsInterface,
	docworksSubServiceToDtsNamespace
}
