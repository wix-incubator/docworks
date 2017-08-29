import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('service operations', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/service-operations.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should return methods with one parameter', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'oneParam', nameParams: [], params: [
                                {name: 'input', type: 'string'}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation oneParam');
        });

        it('should return method location', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'oneParam', locations: [{filename: 'service-operations.js', lineno: 10}]}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation oneParam');
        });

        it('should return methods with two parameter', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'twoParams', nameParams: [], params: [
                                {name: 'input', type: 'string'},
                                {name: 'input2', type: 'number'}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation twoParams');
        });

        it('should return a method with a return value', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'returns', nameParams: [], params: [], ret: {type: 'string'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation returns');
        });

        it('should return a method with an array return value', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'returnsArray', nameParams: [], params: [], ret: {type: {name: 'Array', typeParams: ['string']}}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation returnsArray');
        });

        it('should return a method with a promise return value', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'returnsPromise', nameParams: [], params: [], ret: {type: {name: 'Promise', typeParams: ['string']}}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation returnsPromise');
        });

        it('should error on multiple returns', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'multipleReturns', nameParams: [], params: [], ret: {type: 'string'}}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Operation multipleReturns has multiple returns annotations',
                        location: 'service-operations.js (50)'
                    }
                ]
            });
        });

        it('should error on duplicate operation', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'duplicate', nameParams: [], params: [], ret: {type: 'string'}}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Operation duplicate is defined two or more times',
                        location: 'service-operations.js (90, 103)'
                    }
                ]
            });
        });

        it('should support optional param', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'optional', nameParams: [], params: [
                                {name: 'param', type: 'string', optional: true}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation optional');
        });

        it('should support optional param with default value', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'defaultValue', nameParams: [], params: [
                                {name: 'param', type: 'string', optional: true, defaultValue:"default"}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation defaultValue');
        });

        it('should support varargs param', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceOperations',
                        operations: [
                            {name: 'varargs', nameParams: [], params: [
                                {name: 'param', type: 'string', spread: true}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation varargs');
        });

    });
});