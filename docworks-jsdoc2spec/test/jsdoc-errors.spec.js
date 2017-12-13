import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('service', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/jsdoc-errors.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });

        it.only('should return the service for each class', function() {

            expect(jsDocRes).to.containSubset({
                errors: [
                    'ERROR: The @description tag requires a value. File: jsdoc-errors.js, line: 8',
                    'ERROR: The @description tag requires a value. File: jsdoc-errors.js, line: 16'
                ]
            });
        });

    });
});