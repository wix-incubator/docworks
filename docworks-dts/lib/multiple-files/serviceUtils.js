const has_ = require('lodash/has')
const set_ = require('lodash/set')
const isEmpty_ = require('lodash/isEmpty')
const { SUB_SERVICES_KEY } = require('./constants')

const isRootService = service => !service.memberOf
const withServicesProperty = service =>
	Object.assign({ [SUB_SERVICES_KEY]: {} }, service)

const isEmptyInterface = service =>
	isEmpty_(service.properties) && isEmpty_(service.operations)

const isEmptyNamespace = service =>
	isEmpty_(service.services) &&
	isEmpty_(service.messages) &&
	isEmpty_(service.callbacks)

const getServiceSummary = service =>
	service && service.docs && service.docs.summary ? service.docs.summary : ''

const createModulesMapManager = () => {
	const map_ = {}

	const getSubPath = moduleName => {
		const innerServicePath = moduleName.split('.').join(`.${SUB_SERVICES_KEY}.`)
		return `${innerServicePath}.${SUB_SERVICES_KEY}`
	}

	const addRoot = service => {
		map_[service.name] = withServicesProperty(service)
	}

	const hasModule = moduleName => {
		if (moduleName.includes('.')) {
			return has_(map_, getSubPath(moduleName))
		} else {
			return has_(map_, moduleName)
		}
	}

	const addSub = serviceJson => {
		set_(
			map_,
			`${getSubPath(serviceJson.memberOf)}.${serviceJson.name}`,
			withServicesProperty(serviceJson)
		)
	}
	return {
		getMap: () => map_,
		addRoot,
		addSub,
		hasModule
	}
}

const sortServices = (firstService, secondService) => {
	const {
		name: firstServiceName,
		memberOf: firstServiceMemberOf
	} = firstService
	const {
		name: secondServiceName,
		memberOf: secondServiceMemberOf
	} = secondService
	if (!firstServiceMemberOf && !secondServiceMemberOf) return 0
	if (firstServiceMemberOf && !secondServiceMemberOf) return 1
	if (!firstServiceMemberOf && secondServiceMemberOf) return -1

	// firstServiceMemberOf && secondServiceMemberOf
	const fisrtServiceFullName = `${firstServiceMemberOf}.${firstServiceName}`
	const secondServiceFullName = `${secondServiceMemberOf}.${secondServiceName}`
	return fisrtServiceFullName.localeCompare(secondServiceFullName)
}

const createHierarchicalServicesMap = services => {
	const sortedServices = services.sort(sortServices)
	const modulesMapManager = createModulesMapManager()
	const errors = []
	while (sortedServices.length) {
		const serviceJson = sortedServices.shift()
		if (isRootService(serviceJson)) {
			modulesMapManager.addRoot(serviceJson)
			continue
		}
		if (modulesMapManager.hasModule(serviceJson.memberOf)) {
			modulesMapManager.addSub(serviceJson)
			continue
		}

		if (serviceJson.parentServiceNotFound) {
			errors.push(
				`error in ${serviceJson.name} service json. can't find parent service ${serviceJson.memberOf}.`
			)
			continue
		}

		serviceJson.parentServiceNotFound = true
		sortedServices.push(serviceJson)
	}
	if (!isEmpty_(errors)) throw new Error(errors)

	return modulesMapManager.getMap()
}
module.exports = {
	isEmptyInterface,
	isEmptyNamespace,
	getServiceSummary,
	createHierarchicalServicesMap
}
