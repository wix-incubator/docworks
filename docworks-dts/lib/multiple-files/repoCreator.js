const {
	isEmptyModule,
	createHierarchicalServicesMap
} = require('./serviceUtils')
const { moduleBuilder, $wGlobalNamespaceBuilder } = require('./builders')
const { $W_NAME } = require('./constants')
const { getModulesDependenciesMap } = require('./providers/modulesDependencies')
const { emit, dtsImportDefault } = require('./generators')

const is$w = name => name === $W_NAME
const addIndentation = (statment) => `\t${statment}`

const createModulesFilesMap = ({ services, run$wFixer }) => {
	const servicesMap = createHierarchicalServicesMap(services)
	return Object.keys(servicesMap).reduce((filesMap, moduleId) => {
		const rootService = servicesMap[moduleId]
		if (isEmptyModule(rootService)) return filesMap
    const moduleName = is$w(moduleId) || !rootService.displayName ? moduleId : rootService.displayName
		return {
			...filesMap,
			[moduleName]: is$w(moduleId)
				? $wGlobalNamespaceBuilder(rootService, { run$wFixer })
				: moduleBuilder(rootService)
		}
	}, {})
}

const createImportStatements = dependencies => {
	return Object.keys(dependencies).map(depModuleKey => {
		const dependency = dependencies[depModuleKey]
		return addIndentation(emit(dtsImportDefault(dependency.to, dependency.from)))
	})
}

const prependImportStatements = (module, extraContent) => {
	if (module) {
		const declarationParts = module.content.split('\n')
		const indexOfDeclareStatment = declarationParts.findIndex(dPart =>
			dPart.includes('declare module')
		)
		const declarationWithImportStatements = [
			...declarationParts.slice(0, indexOfDeclareStatment + 1),
			...extraContent,
			...declarationParts.slice(indexOfDeclareStatment + 1)
		]
		module.content = declarationWithImportStatements.join('\n')
	}
}

const repoCreator = ({ services, run$wFixer }) => {
	const modulesFiles = createModulesFilesMap({ services, run$wFixer })

	const modulesDependencies = getModulesDependenciesMap()
	Object.keys(modulesDependencies).forEach(moduleKey => {
		const dependencies = modulesDependencies[moduleKey]
		const importStatments = createImportStatements(dependencies)
		prependImportStatements(modulesFiles[moduleKey], importStatments)
	})

	return modulesFiles
}
module.exports = repoCreator
