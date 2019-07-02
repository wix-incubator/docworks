import runJsDoc from '../lib/jsdoc-runner'
import {dump} from '../lib/util'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

describe('docs', function() {
    describe('service', function() {
        let jsDocRes
        beforeEach(() => {
            jsDocRes = runJsDoc({
                'include': [
                    'test/jsdoc-errors.js'
                ]
            })
        })

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                // eslint-disable-next-line no-console
                console.log('the jsDocRes:')
                dump(jsDocRes)
            }
        })

        it('should return the service for each class', function() {

            expect(jsDocRes).to.containSubset({
                errors: [
                  {message: 'ERROR: The @description tag requires a value. File: jsdoc-errors.js, line: 9'},
                  {message: 'ERROR: The @description tag requires a value. File: jsdoc-errors.js, line: 17'}
                ]
            })
        })

    })
})
