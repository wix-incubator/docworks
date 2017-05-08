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
                    "test/service-sanity.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should return the service properties', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'Service',
                        properties: [
                            {name: 'label', get: true, set: true, type: 'string'}
                        ]
                    }
                ]
            });
        });

        it('should return the service methods', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'Service',
                        operations: [
                            {name: 'operation', nameParams: [], params: [
                                {name: 'input', type: 'string'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
        });
    });
});