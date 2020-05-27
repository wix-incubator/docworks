import runJsDoc from 'docworks-jsdoc2spec'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

import babelPlugin from '../src/index'


const runJsDocWithPlugin = (sourcePath) => {
  babelPlugin.init('ts')
  return runJsDoc({include: [sourcePath]}, ['.'])
}

describe('Typescript Support', function() {

  it('should read from a typescript file', function () {
    const jsDocRes = runJsDocWithPlugin('test/tscode.ts')
    expect(jsDocRes).to.containSubset({
      services: [
        {
          name: 'TSCode', memberOf: 'aNamespace',
          operations: [
            {name: 'doSomething', nameParams: [], params: [], ret: {type: {name: 'Promise', typeParams: ['string']}}}
          ]
        }
      ]
    })
  })

})

