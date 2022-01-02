const camelCase_ = require('lodash/camelCase')

let moduleDependenciesMap = {}
const getModulesDependenciesMap = () => moduleDependenciesMap
const addDependency = (dependentName, dependencyName) => {
	if (!(dependentName in moduleDependenciesMap)) {
		moduleDependenciesMap[dependentName] = {}
	}
	const camelCaseDependencyName = camelCase_(dependencyName)
	moduleDependenciesMap[dependentName][camelCaseDependencyName] = {
		from: dependencyName,
		to: camelCaseDependencyName
	}
}
module.exports = {
	init: () => (moduleDependenciesMap = {}),
	addDependency,
	getModulesDependenciesMap
}
