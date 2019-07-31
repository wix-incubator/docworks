import chai from 'chai'
import chaiSubset from 'chai-subset'
import fsExtra from 'fs-extra'
import * as logger from './test-logger'
import {createRemoteOnVer1, runCommand} from './test-utils'

chai.use(chaiSubset)
const expect = chai.expect

describe('tern workflow e2e', function() {

  beforeEach(() => {
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

  it('generate tern from a remote repo', async function() {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')
    await runCommand(`.bin/docworks tern -r ${remote} -u http://base-url.com -n apiname -o ./tmp/tern.js`.split(' '))

    let content = await fsExtra.readFile('tmp/tern.js', 'utf-8')

    expect(content).to.equal(
      `{
	"!define": {
		"Service": {
			"!doc": "this is a service",
			"!url": "http://base-url.com/Service.html",
			"prototype": {
				"operation": {
					"!type": "fn(param: string)",
					"!doc": "",
					"!url": "http://base-url.com/Service.html#operation"
				}
			}
		}
	},
	"!name": "apiname"
}`
    )
  })

  it('generate tern from a remote repo with a tern plugin', async function() {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')
    await runCommand(`.bin/docworks tern -r ${remote} -u http://base-url.com -n apiname -o ./tmp/tern.js --plug ./test/tern-plugin.js`.split(' '))

    let content = await fsExtra.readFile('tmp/tern.js', 'utf-8')

    expect(content).to.equal(
      `{
	"!define": {
		"Service": {
			"!doc": "this is a service",
			"!url": "http://base-url.com/Service.html",
			"prototype": {
				"operation": {
					"!type": "fn(param: string)",
					"!doc": "",
					"!url": "http://base-url.com/Service.html#operation",
					"!eventType": "hello"
				}
			}
		}
	},
	"!name": "apiname"
}`
    )
  })
})
