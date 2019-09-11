import runJsDoc from '../lib/jsdoc-runner'
import { dump } from '../lib/util'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

describe('docs', function () {
  describe('service nonqueriable', function () {
    let jsDocRes
    beforeEach(() => {
      jsDocRes = runJsDoc({
        'include': [
          'test/service-nonqueriable.js'
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


    it('should set queriable flag to flase', function () {
      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'ServiceNonQueriable',
            extra: {}
          }
        ]
      })
      expect(jsDocRes.errors).to.not.containError('Property readOnly')
    })
  })
})