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
    const convertedWitheSpaces = escapedString.replace(/[\s]+/g, '[\\s]+')

    return new RegExp(convertedWitheSpaces)
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

  it('generate dts from a remote repo', async function () {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')

    await runCommand(`.bin/docworks dts -r ${remote} -o ./tmp/globals`.split(' '))

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

    await runCommand('.bin/docworks dts -l ./test/docworks-service -o ./tmp/globals2'.split(' '))

    let content = await fsExtra.readFile('tmp/globals2.d.ts', 'utf-8')

    expect(content).to.match(strToRegexUnionWhiteSpaces(
      `/**
        * this is a service
        */
      declare module 'Service' {
          function operation(param: string): void;
      
      }`))
  })
})
