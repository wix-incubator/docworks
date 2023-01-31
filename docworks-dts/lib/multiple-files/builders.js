const getDocumentationGenerator = require('./providers/documentationGenerator')
const {
	emit,
	dtsAlias,
	dtsModule,
	dtsNamespace,
	dtsImportDefault,
	dtsWrapNamespaceWithGlobal
} = require('./generators')
const {
	isEmptyInterface,
	isEmptyNamespace,
	getServiceSummary
} = require('./serviceUtils')
const {
	docworksMixesToDtsBaseType,
	docworksMessageToDtsType,
	docworksPropertyToDtsConst,
	docworksOperationToDtsFunction,
	docworksCallbackToDtsFunctionType,
	docworksSubServiceToDtsInterface,
	docworksSubServiceToDtsNamespace
} = require('./convertors')
const {
	DATASET,
	DYNAMIC_DATASET,
	SUB_SERVICES_KEY,
	$W_NAME
} = require('./constants')

const moduleBuilder = service => {
	const {
		name,
		properties = [],
		operations = [],
		messages = [],
		callbacks = [],
		[SUB_SERVICES_KEY]: subServices = {}
	} = service

	const constMembers = properties.map(property =>
		docworksPropertyToDtsConst(property, service)
	)

	const functionMembers = operations.map(operation =>
		docworksOperationToDtsFunction(operation, service)
	)

	const typesMembers = messages.map(message =>
		docworksMessageToDtsType(message, service)
	)

	const handlersMembers = callbacks.map(callback =>
		docworksCallbackToDtsFunctionType(callback, service)
	)

	const interfacesMembers = Object.values(subServices)
		.filter(s => !isEmptyInterface(s))
		.map(interface_ => docworksSubServiceToDtsInterface(interface_))

	const namespacesMembers = Object.values(subServices)
		.filter(s => !isEmptyNamespace(s))
		.map(namespace => docworksSubServiceToDtsNamespace(namespace))

	const members = [
		...constMembers,
		...functionMembers,
		...typesMembers,
		...handlersMembers,
		...interfacesMembers,
		...namespacesMembers
	]

	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: getServiceSummary(service),
		service: name
	})

	const content = emit(dtsModule(name, { members, jsDocComment }))

	return {
		name,
		content
	}
}

const get$wDatasetMembers = () => {
	const datasetComponentType = dtsAlias(
		DATASET.COMPONENT_NAME,
		`${DATASET.MODULE_NAME}.${DATASET.MEMBER}`
	)
	const routerDatasetComponentType = dtsAlias(
		DYNAMIC_DATASET.COMPONENT_NAME,
		`${DYNAMIC_DATASET.MODULE_NAME}.${DYNAMIC_DATASET.MEMBER}`
	)
	return [datasetComponentType, routerDatasetComponentType]
}

const $wGlobalNamespaceBuilder = (service, { run$wFixer }) => {
	const {
		name,
		messages = [],
		callbacks = [],
		[SUB_SERVICES_KEY]: subServices = {}
	} = service

	const typesMembers = messages.map(message =>
		docworksMessageToDtsType(message, service)
	)

	const handlersMembers = callbacks.map(callback =>
		docworksCallbackToDtsFunctionType(callback, service)
	)

	const interfacesMembers = Object.values(subServices).map(interface_ =>
		docworksSubServiceToDtsInterface(interface_)
	)

	const namespacesMembers = Object.values(subServices)
		.filter(s => !isEmptyNamespace(s))
		.map(namespace => docworksSubServiceToDtsNamespace(namespace))

	const extraComponents = run$wFixer ? get$wDatasetMembers() : []
	const members = [
		...typesMembers,
		...extraComponents,
		...handlersMembers,
		...interfacesMembers,
		...namespacesMembers
	]

	const documentationGenerator = getDocumentationGenerator()
	const jsDocComment = documentationGenerator({
		summary: getServiceSummary(service),
		service: name
	})
	const baseTypes = docworksMixesToDtsBaseType(service)

	const $wNamespace = dtsNamespace(name, { baseTypes, jsDocComment })

	$wNamespace.members = members

	let content = dtsWrapNamespaceWithGlobal($W_NAME, emit($wNamespace))

	if (run$wFixer) {
		const importStatment = emit(
			dtsImportDefault(DATASET.MODULE_NAME, DATASET.FROM)
		)
		content = `${importStatment}\n${content}`
	}

	return {
		name,
		content
	}
}

module.exports = {
	moduleBuilder,
	$wGlobalNamespaceBuilder
}
