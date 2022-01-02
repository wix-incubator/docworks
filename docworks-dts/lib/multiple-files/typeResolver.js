const camelCase_ = require('lodash/camelCase')
const { addDependency } = require('./providers/modulesDependencies')
const { $W_NAME, TYPES } = require('./constants')
const {
	BASE_TYPES,
	dtsUnion,
	dtsIntersection,
	dtsNamedTypeReference
} = require('./generators')

const isString = value => typeof value === 'string'
const hasNameProperty = type => typeof type === 'object' && type.name
const isListOfTypes = type => Array.isArray(type) && type.length > 0
const isInvalidOptions = ({ intersection, union }) =>
	(intersection && union) || (!intersection && !union)

// Array of more one value defines for us a union type.
const isUnionType = docsTypes => {
	return docsTypes.length > 1
}

// Supported key value types: Record/Map.
const isKeyValueType = typeName => {
	return [TYPES.RECORD, TYPES.MAP].some(t => t === typeName)
}

// Docs Type Definition: https://github.com/wix-private/p13n/blob/master/wixplorer/wix-docs-server/proto/docs/README.md
const isNewDocsTypesDefinition = type =>
	type.some(
		({ nativeType, complexType, referenceType }) =>
			nativeType || complexType || referenceType
	)

const isRootMember = (type, { name }) => type.startsWith(`${name}.`)

const isInnerMember = (type, { name, memberOf }) =>
	memberOf && type.includes(`${name}.`) && type.includes(`${memberOf}.`)

const isSameModule = (type, { memberOf }) => {
	if (!memberOf) return false
	const [memberOfRootModule] = memberOf.split('.')
	const [typePartsRootModule] = type.split('.')
	return type.includes('.') && memberOfRootModule === typePartsRootModule
}

const isTypeGlobal = (type) => type.startsWith($W_NAME)

const isCrossReferenceType = (type, service) =>
	type.includes('.') && !isSameModule(type, service)

const resolveCrossReferenceType = (type, service) => {
	if (isTypeGlobal(type)) return type

	const { name, memberOf } = service
	const [currentModuleName] = memberOf ? memberOf.split('.') : [name]
	const [crossedTypeModuleName, ...otherParts] = type.split('.')

	addDependency(currentModuleName, crossedTypeModuleName)
	return `${camelCase_(crossedTypeModuleName)}.${otherParts.join('.')}`
}

const normalizeType = (type, service) => {
	if (isString(type)) {
		const { name: parentServiceName } = service
		if (isRootMember(type, service)) {
			return type.replace(`${parentServiceName}.`, '')
		}
		if (isInnerMember(type, service)) {
			const splitedParts = type.split(`${service.memberOf}.`)
			return `${splitedParts[splitedParts.length - 1]}`
		}
		if (isSameModule(type, service)) {
			const [rootModule] = type.split('.')
			return type.replace(`${rootModule}.`, '')
		}
		if (isCrossReferenceType(type, service)) {
			return resolveCrossReferenceType(type, service)
		}
	}
	return type
}

// The key is the first type of the array, or by key property.
const getKeyValueDefinitions = typeParams => {
	const typeParamsByKey = typeParams.sort(({ key: keyA }, { key: keyB }) => {
		if (keyA === true) return -1
		if (keyB === true) return 1
		return 0
	})
	const [key, value] = typeParamsByKey

	return { key, value }
}

const resolveStringType = (type, service) => {
	if (type in BASE_TYPES) return BASE_TYPES[type]
	return normalizeType(type, service)
}

const resolveDocsType = (docsTypes, service) => {
	if (isUnionType(docsTypes)) {
		return docsTypes
			.map(t => normalizeType(resolveDocsType([t], service), service))
			.join(' | ')
	}

	const [firstDocsType] = docsTypes
	const { nativeType, referenceType, complexType } = firstDocsType

	if (referenceType) return normalizeType(referenceType, service)
	if (nativeType) return normalizeType(nativeType, service)
	if (complexType) {
		const typeName = resolveDocsType([complexType], service)

		if (isKeyValueType(typeName)) {
			const { key, value } = getKeyValueDefinitions(complexType.typeParams)
			return `${typeName}<${resolveDocsType([key], service)}, ${resolveDocsType(
				[value],
				service
			)}>`
		}
		return `${typeName}<${resolveDocsType(complexType.typeParams, service)}>`
	}
}

const resolveType = (type, service, options = {}) => {
	if (isString(type)) {
		return resolveStringType(type, service)
	} else if (hasNameProperty(type)) {
		const { name, typeParams: [typeParam] } = type
		if (name === TYPES.ARRAY) {
			return `${resolveType(typeParam, service)}[]`
		}
		if (name === TYPES.PROMISE) {
			return dtsNamedTypeReference(
				`Promise<${resolveType(typeParam, service)}>`
			)
		}
	} else if (isListOfTypes(type)) {
		if (isNewDocsTypesDefinition(type)) {
			const createdDocsNamedType = resolveDocsType(type, service)
			return dtsNamedTypeReference(createdDocsNamedType)
		}
		if (isInvalidOptions(options)) {
			throw new Error(
				`Unable to convert type ${type} to type union or intersection. Options must include only one flag`
			)
		}
		const { union, intersection } = options
		const types = type.map(t => resolveType(t, service))

		if (union) return dtsUnion(types)
		if (intersection) return dtsIntersection(types)
	}

	throw new Error(`Unable to convert type ${type} to valid dts type`)
}
module.exports = {
	resolveType
}
