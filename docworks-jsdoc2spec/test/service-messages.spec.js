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
                    "test/service-messages.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should report service property of a message type', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        properties: [
                            {name: 'prop', get: true, set: false, type: 'aNamespace.ServiceMessages.OutMessage'}
                        ]
                    }
                ]
            });
        });

        it('should support messages', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        messages: [
                            {
                                name: 'OutMessage',
                                members: [
                                    {name: 'name', type: 'string'},
                                    {name: 'age', type: ['string', 'number']}
                                ]
                            },
                            {
                                name: 'InMessage',
                                members: [
                                    {name: 'name', type: 'string'},
                                    {name: 'age', type: ['string', 'number']}
                                ]
                            }
                        ]
                    }
                ]
            });
        });

        it('should support message location', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        messages: [
                            {
                                name: 'OutMessage',
                                locations: [{filename: 'service-messages.js', lineno: 17}]
                            },
                            {
                                name: 'InMessage',
                                locations: [{filename: 'service-messages.js', lineno: 10}]
                            }
                        ]
                    }
                ]
            });
        });

        it('should support a function with message types', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        operations: [
                            {name: 'operation', nameParams: [], params: [
                                {name: 'input', type: 'aNamespace.ServiceMessages.InMessage'}
                            ], ret: 'aNamespace.ServiceMessages.OutMessage'}
                        ]
                    }
                ]
            });
        });

        it('should support a function with a complex message type', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        operations: [
                            {name: 'operationComplex', nameParams: [], params: [
                                {name: 'input', type: 'aNamespace.ServiceMessages.ComplexMessage'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
        });

        it('should support a complex message', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceMessages',
                        messages: [
                            {
                                name: 'ComplexMessage',
                                members: [
                                    {name: 'in1', type: 'aNamespace.ServiceMessages.InMessage'},
                                    {name: 'in2', type: 'aNamespace.ServiceMessages.InMessage'}
                                ]
                            },
                            {
                                name: 'InMessage',
                                members: [
                                    {name: 'name', type: 'string'},
                                    {name: 'age', type: ['string', 'number']}
                                ]
                            }
                        ]
                    }
                ]
            });
        });

    });
});