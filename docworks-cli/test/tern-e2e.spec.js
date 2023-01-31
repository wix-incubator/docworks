import chai from 'chai'
import chaiSubset from 'chai-subset'
import fsExtra from 'fs-extra'
import * as logger from './test-logger'
import {addLoggerToErrorStack, createRemoteOnVer1, runCommand} from './test-utils'

chai.use(chaiSubset)
const expect = chai.expect

describe('tern workflow e2e', function () {

  beforeEach(() => {
    logger.reset()
    fsExtra.removeSync('./tmp')
  })

  afterEach(function () {
    const errorStack = this.currentTest.err && this.currentTest.err.stack
    if (errorStack) {
      this.currentTest.err.stack = addLoggerToErrorStack(logger, errorStack)
    }
  })

  it('generate tern from a remote repo', async function (done) {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')
    await runCommand(`./bin/docworks tern -r ${remote} -u http://base-url.com -n apiname -o ./tmp/tern.js`.split(' '))

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
    done()
  })

  it('generate tern from a remote repo\'s non-master branch', async function (done) {
    const remote = './tmp/remote'
    const branch = 'test-branch'
    await createRemoteOnVer1(remote, branch)
    logger.log('run test')
    logger.log('--------')
    await runCommand(`./bin/docworks tern -r ${remote} -b ${branch} -u http://base-url.com -n apiname -o ./tmp/tern.js`.split(' '))

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
    done()
  })

  it('generate tern from a remote repo with a tern plugin', async function (done) {
    const remote = './tmp/remote'
    await createRemoteOnVer1(remote)
    logger.log('run test')
    logger.log('--------')
    await runCommand(`./bin/docworks tern -r ${remote} -u http://base-url.com -n apiname -o ./tmp/tern.js --plug ./test/tern-plugin.js`.split(' '))

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
    done()
  })
})
