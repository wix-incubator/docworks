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

        it.only('should support a function with message types', function() {

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
    });
});