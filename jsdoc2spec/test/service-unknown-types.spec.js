import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('service types', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/service-unknown-types.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should report error on unknown types', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceUnknownTypes',
                        operations: [
                            {name: 'unknownType', nameParams: [], params: [
                                {name: 'unknown', type: 'Unknown1'}
                            ], ret: 'Unknown2'}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Operation unknownType has an Unknown param type Unknown1',
                        location: 'service-unknown-types.js (10)'
                    },
                    {
                        message: 'Operation unknownType has an Unknown return type Unknown2',
                        location: 'service-unknown-types.js (10)'
                    }

                ]
            });
        });
    });
});