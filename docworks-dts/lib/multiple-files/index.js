const repoCreator = require('./repoCreator')
const { dtsTripleSlashReference } = require('./generators')
const {
	set: setDocumentationGenerator
} = require('./providers/documentationGenerator')

const {
	init: initModulesDependencies
} = require('./providers/modulesDependencies')

const getMainContent = modulesNames =>
	modulesNames.reduce(
		(content, name) => content + dtsTripleSlashReference(name) + '\n',
		''
	)

const generateMainFile = (wixModuleFiles, mainFileName) => {
	const modulesNames = Object.values(wixModuleFiles).map(({ name }) => name)
	return {
		name: mainFileName,
		content: getMainContent(modulesNames)
	}
}

const main = (
	services,
	{
		run$wFixer = false,
		summaryTemplate,
		ignoredModules = [],
		mainFileName = 'index.d.ts'
	} = {}
) => {
	initModulesDependencies()
	setDocumentationGenerator(summaryTemplate)

	const wixModuleFiles = repoCreator({ services, run$wFixer })
	ignoredModules.forEach(module => delete wixModuleFiles[module])
	wixModuleFiles[mainFileName] = generateMainFile(wixModuleFiles, mainFileName)

	return Object.values(wixModuleFiles)
}
module.exports = main
