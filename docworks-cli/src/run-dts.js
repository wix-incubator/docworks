const path = require('path')
const { dtsMultipleFiles } = require('docworks-dts')
const dts = require('docworks-dts')
const logger = require('./logger')
const { writeOutput } = require('./utils/fsUtil')
const { readRepoFromRemoteOrLocal } = require('./utils/gitUtils')

async function runDts(
	outputFileName,
	outputDirName,
	{
		remote,
		local,
		run$wFixer,
		summaryTemplate,
		ignoredModules,
		ignoredNamespaces,
		multipleFiles = false
	}
) {
	try {
		let repo = await readRepoFromRemoteOrLocal({ remote, local })
		const { services } = repo

		logger.command('docworks dts', '')
		if (run$wFixer) {
			logger.command('running with $w fixer', '')
		}

		if (multipleFiles) {
			logger.command('using multiple files mode', '')

			const dtsResult = dtsMultipleFiles(services, {
				run$wFixer,
				summaryTemplate,
				ignoredModules,
				ignoredNamespaces,
				mainFileName: outputFileName
			})

			logger.command('saving dts files...', outputDirName)
			return Promise.all(
				dtsResult.map(res =>
					writeOutput(`${outputDirName}/${res.name}.d.ts`, res.content)
				)
			)
		}
		const dtsResult = dts(services, {
			run$wFixer,
			summaryTemplate,
			ignoredModules,
			ignoredNamespaces
		})
		const fileNameWithExtensions = `${outputFileName}.d.ts`
		const fullPath = path.join(outputDirName, fileNameWithExtensions)

		logger.command('dts saving to file...', fullPath)

		return writeOutput(fullPath, dtsResult)
	} catch (error) {
		logger.error('failed to complete workflow\n' + error.stack)
		throw error
	}
}

module.exports = runDts
