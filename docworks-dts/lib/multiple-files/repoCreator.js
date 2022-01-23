const {
	isEmptyModule,
	createHierarchicalServicesMap
} = require('./serviceUtils')
const { moduleBuilder, $wGlobalNamespaceBuilder } = require('./builders')
const { $W_NAME } = require('./constants')

const is$w = name => name === $W_NAME

const createModulesFilesMap = ({ services, run$wFixer }) => {
	const servicesMap = createHierarchicalServicesMap(services)
	return Object.keys(servicesMap).reduce((filesMap, moduleName) => {
		const rootService = servicesMap[moduleName]
		if (isEmptyModule(rootService)) return filesMap
		return {
			...filesMap,
			[moduleName]: is$w(moduleName)
				? $wGlobalNamespaceBuilder(rootService, { run$wFixer })
				: moduleBuilder(rootService)
		}
	}, {})
}

const repoCreator = ({ services, run$wFixer }) => {
	const modulesFiles = createModulesFilesMap({ services, run$wFixer })

	return modulesFiles
}
module.exports = repoCreator
