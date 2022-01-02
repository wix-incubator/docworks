import chai from 'chai'
import chaiSubset from 'chai-subset'
import fsExtra from 'fs-extra'
import * as logger from './test-logger'
import {
	addLoggerToErrorStack,
	createRemoteOnVer1,
	runCommand
} from './test-utils'
import _ from 'lodash'

chai.use(chaiSubset)
const expect = chai.expect

describe('dts workflow e2e', function() {
	function strToRegexUnionWhiteSpaces(string) {
		const escapedString = _.escapeRegExp(string)
		const convertedWhiteSpaces = escapedString.replace(/[\s]+/g, '[\\s]+')

		return new RegExp(convertedWhiteSpaces)
	}

	beforeEach(async () => {
		logger.reset()
		fsExtra.removeSync('./tmp')
	})

	afterEach(function() {
		const errorStack = this.currentTest.err && this.currentTest.err.stack
		if (errorStack) {
			this.currentTest.err.stack = addLoggerToErrorStack(logger, errorStack)
		}
	})

	function extractDeclarations(content) {
		const declarationRegex = /^declare .*$/gm
		return content.match(declarationRegex)
	}

	it('generate dts from a remote repo', async function() {
		const remote = './tmp/remote'
		await createRemoteOnVer1(remote)
		logger.log('run test')
		logger.log('--------')

		await runCommand(
			`./bin/docworks dts -r ${remote} -o ./tmp/globals`.split(' ')
		)

		let content = await fsExtra.readFile('tmp/globals.d.ts', 'utf-8')

		expect(content).to.match(
			strToRegexUnionWhiteSpaces(
				`/**
        * this is a service
        */
      declare module 'Service' {
          function operation(param: string): void;

      }`
			)
		)
	})

	it('generate dts from a local folder', async function() {
		logger.log('run test')
		logger.log('--------')

		await runCommand(
			'./bin/docworks dts -l ./test/docworks-service -o ./tmp/globals2'.split(
				' '
			)
		)

		let content = await fsExtra.readFile('tmp/globals2.d.ts', 'utf-8')

		expect(extractDeclarations(content)).to.deep.equal([
			'declare module \'Service\' {',
			'declare module \'Service2\' {',
			'declare namespace someNamespace {'
		])
		expect(content).to.match(
			strToRegexUnionWhiteSpaces(
				`/**
        * this is a service
        */
      declare module 'Service' {
          function operation(param: string): void;

      }`
			)
		)
	})

	it('generate dts from a with ignoring a module', async function() {
		logger.log('run test')
		logger.log('--------')

		await runCommand(
			'./bin/docworks dts -M Service2 -l ./test/docworks-service -o ./tmp/globals3'.split(
				' '
			)
		)

		const content = await fsExtra.readFile('tmp/globals3.d.ts', 'utf-8')

		expect(extractDeclarations(content)).to.deep.equal([
			'declare module \'Service\' {',
			'declare namespace someNamespace {'
		])
	})

	it('generate dts from a with ignoring a namespace', async function() {
		logger.log('run test')
		logger.log('--------')

		await runCommand(
			'./bin/docworks dts -N someNamespace -l ./test/docworks-service -o ./tmp/globals4'.split(
				' '
			)
		)

		const content = await fsExtra.readFile('tmp/globals4.d.ts', 'utf-8')

		expect(extractDeclarations(content)).to.deep.equal([
			'declare module \'Service\' {',
			'declare module \'Service2\' {'
		])
	})

	describe('with mutiple files param', () => {
		const DOCWORKS_TEST_REPO = 'test/docworks-repo'
		const DOCWORKS_MULTIPLE_FILES_OUTPUT_DIR = 'tmp/multiple-files'
		const DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME = 'testname'
		const DOCWORKS_TEST_REPO_PARENT_MODULES = [
			'a-module',
			'b-module',
			'c-module'
		]

		const isSameValues = (arr1, arr2) =>
			arr1.sort().join('') === arr2.sort().join('')

		const readDirWithContent = async dir => {
			const files = await fsExtra.readdir(dir)
			return files.reduce(async (map, f) => {
				const content = await fsExtra.readFile(
					`tmp/multiple-files/${f}`,
					'utf-8'
				)
				return {
					...(await map),
					[f]: content
				}
			}, {})
		}

		it('should generate mutiple files dts model', async () => {
			const expectedOutputFiles = DOCWORKS_TEST_REPO_PARENT_MODULES.concat([
				DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME
			]).map(name => `${name}.d.ts`)

			const expecteReferenceStatements = DOCWORKS_TEST_REPO_PARENT_MODULES.map(
				name => `/// <reference path='./${name}.d.ts' />`
			)

			const command = `./bin/docworks dts -l ./${DOCWORKS_TEST_REPO} -d ./${DOCWORKS_MULTIPLE_FILES_OUTPUT_DIR} -o ${DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME} --multipleFiles`
			await runCommand(command.split(' '))

			const filesContent = await readDirWithContent(
				DOCWORKS_MULTIPLE_FILES_OUTPUT_DIR
			)
			expect(
				isSameValues(Object.keys(filesContent), expectedOutputFiles)
			).to.equal(true)

			DOCWORKS_TEST_REPO_PARENT_MODULES.forEach(parentModule => {
				const moduleContent = filesContent[`${parentModule}.d.ts`]
				expect(moduleContent).to.contain(`declare module '${parentModule}'`)
			})

			const mainFileContent =
				filesContent[`${DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME}.d.ts`]

			expecteReferenceStatements.forEach(statement => {
				expect(mainFileContent).to.contain(statement)
			})
		})

		it('should generate mutiple files dts model with ignoring a module', async () => {
			const moduleToIgnore = 'a-module'
      const parentModulesWithoutIgnoredModule = DOCWORKS_TEST_REPO_PARENT_MODULES.filter(
				name => name !== moduleToIgnore
			)
			const expectedOutputFiles = parentModulesWithoutIgnoredModule
				.concat([DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME])
				.map(name => `${name}.d.ts`)
			const expecteReferenceStatements = parentModulesWithoutIgnoredModule.map(
				name => `/// <reference path='./${name}.d.ts' />`
			)

			const command = `./bin/docworks dts -M ${moduleToIgnore} -l ./${DOCWORKS_TEST_REPO} -d ./${DOCWORKS_MULTIPLE_FILES_OUTPUT_DIR} -o ${DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME} --multipleFiles`
			await runCommand(command.split(' '))

			const filesContent = await readDirWithContent(
				DOCWORKS_MULTIPLE_FILES_OUTPUT_DIR
			)
			expect(
				isSameValues(Object.keys(filesContent), expectedOutputFiles)
			).to.equal(true)

			parentModulesWithoutIgnoredModule.forEach(parentModule => {
				const moduleContent = filesContent[`${parentModule}.d.ts`]
				expect(moduleContent).to.contain(`declare module '${parentModule}'`)
			})

			const mainFileContent =
				filesContent[`${DOCWORKS_MULTIPLE_FILES_MAIN_FILENAME}.d.ts`]

			expecteReferenceStatements.forEach(statement => {
				expect(mainFileContent).to.contain(statement)
			})
			expect(mainFileContent).not.to.contain(
				`/// <reference path='./${moduleToIgnore}.d.ts' />`
			)
		})
	})
})
