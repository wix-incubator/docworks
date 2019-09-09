import runJsDoc from '../lib/jsdoc-runner'
import { dump } from '../lib/util'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

describe('docs', function () {
  describe('service queriable', function () {
    let jsDocRes
    beforeEach(() => {
      jsDocRes = runJsDoc({
        'include': [
          'test/service-queriable.js'
        ]
      })
    })

    afterEach(function () {
      if (this.currentTest.state == 'failed') {
        // eslint-disable-next-line no-console
        console.log('the jsDocRes:')
        dump(jsDocRes)
      }
    })


    it('should support queriable property', function () {
      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'ServiceQueriable',
            extra: {
              queriable: true
            }
          }
        ]
      })
      expect(jsDocRes.errors).to.not.containError('Property readOnly')
    })
  })
})