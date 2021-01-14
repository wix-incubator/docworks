import chai from 'chai'
import chaiSubset from 'chai-subset'
import fsExtra from 'fs-extra'
import * as logger from './test-logger'
import {addLoggerToErrorStack, createRemoteOnVer1, runCommand} from './test-utils'
import _ from 'lodash'

chai.use(chaiSubset)
const expect = chai.expect

describe('dts workflow e2e', function () {

  function strToRegexUnionWhiteSpaces(string) {
    const escapedString = _.escapeRegExp(string)
    const convertedWhiteSpaces = escapedString.replace(/[\s]+/g, '[\\s]+')

    return new RegExp(convertedWhiteSpaces)
  }

  beforeEach(async () => {
    logger.reset()
    fsExtra.removeSync('./tmp')
  })

  afterEach(function () {
    const errorStack = this.currentTest.err && this.currentTest.err.stack
    if (errorStack) {
      this.currentTest.err.stack = addLoggerToErrorStack(logger, errorStack)
    }
  })

  function extractDeclarations(content) {
    const declarationRegex = /^declare .*$/gm
    return content.match(declarationRegex)
  }

  it('generate dts from a remote repo', async function () {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')

    await runCommand(`./bin/docworks dts -r ${remote} -o ./tmp/globals`.split(' '))

    let content = await fsExtra.readFile('tmp/globals.d.ts', 'utf-8')


    expect(content).to.match(strToRegexUnionWhiteSpaces(
      `/**
        * this is a service
        */
      declare module 'Service' {
          function operation(param: string): void;

      }`))
  })

  it('generate dts from a local folder', async function () {
    logger.log('run test')
    logger.log('--------')

    await runCommand('./bin/docworks dts -l ./test/docworks-service -o ./tmp/globals2'.split(' '))

    let content = await fsExtra.readFile('tmp/globals2.d.ts', 'utf-8')

    expect(extractDeclarations(content)).to.deep.equal([
      'declare module \'Service\' {',
      'declare module \'Service2\' {',
      'declare namespace someNamespace {'
    ])
    expect(content).to.match(strToRegexUnionWhiteSpaces(
      `/**
        * this is a service
        */
      declare module 'Service' {
          function operation(param: string): void;

      }`))
  })

  it('generate dts from a with ignoring a module', async function () {
    logger.log('run test')
    logger.log('--------')

    await runCommand('./bin/docworks dts -M Service2 -l ./test/docworks-service -o ./tmp/globals3'.split(' '))

    const content = await fsExtra.readFile('tmp/globals3.d.ts', 'utf-8')

    expect(extractDeclarations(content)).to.deep.equal([
      'declare module \'Service\' {',
      'declare namespace someNamespace {'
    ])
  })

  it('generate dts from a with ignoring a namespace', async function () {
    logger.log('run test')
    logger.log('--------')

    await runCommand('./bin/docworks dts -N someNamespace -l ./test/docworks-service -o ./tmp/globals4'.split(' '))

    const content = await fsExtra.readFile('tmp/globals4.d.ts', 'utf-8')

    expect(extractDeclarations(content)).to.deep.equal([
      'declare module \'Service\' {',
      'declare module \'Service2\' {'
    ])
  })
})
