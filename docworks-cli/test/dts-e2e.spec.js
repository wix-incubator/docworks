import chai from 'chai'
import chaiSubset from 'chai-subset'
import fsExtra from 'fs-extra'
import * as logger from './test-logger'
import {createRemoteOnVer1, runCommand} from './test-utils'

chai.use(chaiSubset)
const expect = chai.expect

describe('dts workflow e2e', function() {

    // /**
    //  * this is a service
    //  */
    // declare module 'Service' {
    //     function operation(param: string): void;
    //
    // }
    const outputRegex = /\/\*\*[\s]+\*[\s]+this is a service[\s]+\*\/[\s]+declare[\s]+module[\s]+'Service'[\s]+{[\s]+function[\s]+operation\(param:[\s]+string\):[\s]+void;[\s]+}/

    beforeEach(async () => {
    logger.reset()
    fsExtra.removeSync('./tmp')
  })

  afterEach(function(){
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack
      let lines = stack.split('\n')
      lines.splice(1, 0, ...logger.get())
      this.currentTest.err.stack = lines.join('\n')
    }
  })

  it('generate dts from a remote repo', async function() {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')

    await runCommand(`.bin/docworks dts -r ${remote} -o ./tmp/globals`.split(' '))

    let content = await fsExtra.readFile('tmp/globals.d.ts', 'utf-8')

    expect(content).to.match(outputRegex)
  })

    it('generate dts from a local folder', async function() {
        logger.log('run test')
        logger.log('--------')

        await runCommand('.bin/docworks dts -l ./test/docworks-service -o ./tmp/globals2'.split(' '))

        let content = await fsExtra.readFile('tmp/globals2.d.ts', 'utf-8')

        expect(content).to.match(outputRegex)
    })
})
