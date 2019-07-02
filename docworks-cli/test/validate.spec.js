import chai from 'chai'
import chaiSubset from 'chai-subset'
import fs from 'fs-extra'

import validate from '../src/validate'
import * as logger from './test-logger'

chai.use(chaiSubset)
const expect = chai.expect

const valid = './test/valid'
const invalid = './test/invalid'

chai.Assertion.addMethod('haveMessageContaining', function (message) {
  let messages = this._obj

  let foundMessage = messages.find(_ => _.includes(message))
  // second, our type check
  this.assert(
    !!foundMessage
    , `expected log messages to contain a message with ${message}`
    , `expected log messages to not contain a message with ${message}, but found the message ${foundMessage}`
    , message    // expected
    , messages   // actual
  )
})


describe('validate workflow', function() {

  beforeEach(() => {
    logger.reset()
    return fs.remove('./tmp')
  })

  afterEach(function(){
    // console.log(this.currentTest)
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack
      let lines = stack.split('\n')
      lines.splice(1, 0, ...logger.get())
      this.currentTest.err.stack = lines.join('\n')
    }
  })

  it('should report valid for valid jsDocs', async function() {
    let isValid = validate({'include': valid, 'includePattern': '.+\\.(js)?$'}, [], logger)

    expect(isValid).to.be.true
    expect(logger.get()).to.haveMessageContaining('jsDoc ok')
  })

  it('should report invalid for invalid jsDocs', async function() {
    let isValid = validate({'include': invalid, 'includePattern': '.+\\.(js)?$'}, [], logger)

    expect(isValid).to.be.false
    expect(logger.get()).to.haveMessageContaining('jsDoc issues detected')
  })

})
