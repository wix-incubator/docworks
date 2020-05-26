import runJsDoc from 'docworks-jsdoc2spec'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

describe('ES6 Support', function() {
  let jsDocRes
  beforeEach(() => {
    jsDocRes = runJsDoc({
        'include': [
          'test/tscode.ts'
        ]
      },
      ['.'])
  })

  afterEach(function () {
    if (this.currentTest.state == 'failed') {
      /* eslint-disable no-console */
      console.log('the jsDocRes:')
      console.log(require('util').inspect(jsDocRes, {colors: true, depth: 9}))
      /* eslint-enable no-console */
    }
  })

  it('should support async functions', function () {

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

  it('should support a function with spread operator ...', function () {

    expect(jsDocRes).to.containSubset({
      services: [
        {
          name: 'TSCode', memberOf: 'aNamespace',
          operations: [
            {
              name: 'concatArrays', nameParams: [], params: [
              {name: 'arr', type: 'Array'},
              {name: 'arr2', type: 'Array'}
            ], ret: {type: 'Array'}
            }
          ]
        }
      ]
    })
  })
})

describe('Class comments', function() {
  let jsDocRes
  beforeEach(() => {
    jsDocRes = runJsDoc({
        'include': [
          'test/box.js'
        ]
      },
      ['.'])
  })

  afterEach(function(){
    if (this.currentTest.state == 'failed') {
      /* eslint-disable no-console */
      console.log('the jsDocRes:')
      console.log(require('util').inspect(jsDocRes, {colors: true, depth: 9}))
      /* eslint-enable no-console */
    }
  })
})
