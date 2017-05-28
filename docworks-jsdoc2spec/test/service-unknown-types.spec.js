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


        it('should report error on unknown operation types', function() {
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
                        message: 'Operation unknownType has an unknown param type Unknown1',
                        location: 'service-unknown-types.js (10)'
                    },
                    {
                        message: 'Operation unknownType has an unknown return type Unknown2',
                        location: 'service-unknown-types.js (10)'
                    }

                ]
            });
        });

        it('should report error on unknown message types', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceUnknownTypes',
                        messages: [
                            {
                                name: 'Type1',
                                members: [
                                    {name: 'unknown', type: 'Unknown1'}
                                ]
                            }
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Message Type1 has an unknown property type Unknown1',
                        location: 'service-unknown-types.js (20)'
                    }

                ]
            });
        });

        it('should not report error on function with full type reference', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceUnknownTypes',
                        operations: [
                            {name: 'typedefFullPath', nameParams: [], params: [
                                {name: 'type2', type: 'aNamespace.ServiceUnknownTypes.Type2'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation typedefFullPath');
        });

        it('should not report error on function with relative type reference', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceUnknownTypes',
                        operations: [
                            {name: 'typedefRelativePath', nameParams: [], params: [
                                {name: 'type2', type: 'aNamespace.ServiceUnknownTypes.Type2'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation typedefRelativePath');
        });

        it('should not report error on function with relative type reference', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceUnknownTypes',
                        properties: [
                            {name: 'unknownProperty', get: true, set: false, type: 'Unknown1'}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property unknownProperty has an unknown type Unknown1',
                        location: 'service-unknown-types.js (48)'
                    }
                ]
            });
        });

        // todo extra types
        // todo docs
    });
});