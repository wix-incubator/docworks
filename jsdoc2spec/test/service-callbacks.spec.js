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
                    "test/service-callbacks.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should support function callbacks', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceCallbacks',
                        operations: [
                            {name: 'operationWithCallback', nameParams: [], params: [
                                {name: 'input', type: 'string'},
                                {name: 'callback', type: 'aNamespace.ServiceCallbacks.aCallback'}
                            ], ret: 'void'}
                        ],
                        callbacks: [
                            {name: 'aCallback', nameParams: [], params: [
                                {name: 'x', type: 'number'},
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation operationWithCallback');
            expect(jsDocRes.errors).to.not.deep.contains('Callback aCallback');
        });

        it('should support function with complex callbacks', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceCallbacks',
                        operations: [
                            {name: 'operationWithComplexCallback', nameParams: [], params: [
                                {name: 'input', type: 'string'},
                                {name: 'callback', type: 'aNamespace.ServiceCallbacks.aComplexCallback'}
                            ], ret: 'void'}
                        ],
                        callbacks: [
                            {name: 'aComplexCallback', nameParams: [], params: [
                                {name: 'x', type: 'number'},
                                {name: 'y', type: 'string'},
                                {name: 'cb', type: 'aNamespace.ServiceCallbacks.aComplexCallbackCallback'}
                            ], ret: {name: 'Promise', typeParams: ['string']}},
                            {name: 'aComplexCallbackCallback', nameParams: [], params: [
                                {name: 'z', type: 'number'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation operationWithComplexCallback');
            expect(jsDocRes.errors).to.not.deep.contains('Callback aComplexCallback');
        });

        it('should report errors for callback with unknown types', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceCallbacks',
                        operations: [
                            {name: 'operationWithErrorCallback', nameParams: [], params: [
                                {name: 'input', type: 'string'},
                                {name: 'callback', type: 'aNamespace.ServiceCallbacks.AnErrorCallback'}
                            ], ret: 'void'}
                        ],
                        callbacks: [
                            {name: 'AnErrorCallback', nameParams: [], params: [
                                {name: 'z', type: 'Unknown'}
                            ], ret: 'void'}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Callback AnErrorCallback has an unknown param type Unknown',
                        location: 'service-callbacks.js (59)'
                    }
                ]

            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation operationWithComplexCallback');
        });

        it('should report errors for unknown callback', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceCallbacks',
                        operations: [
                            {name: 'operationWithUnknownCallback', nameParams: [], params: [
                                {name: 'input', type: 'string'},
                                {name: 'callback', type: 'UnknownCallback'}
                            ], ret: 'void'}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Operation operationWithUnknownCallback has an unknown param type UnknownCallback',
                        location: 'service-callbacks.js (79)'
                    }
                ]

            });
        });
    });
});