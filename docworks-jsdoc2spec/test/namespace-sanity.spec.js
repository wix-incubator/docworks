import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('namespace', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/namespace-sanity.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });

        it('should return the service for each namespace', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {name: 'aNamespace', memberOf: undefined},
                    {name: 'child', memberOf: 'aNamespace'}
                ]
            });
        });

        it('should return the service methods', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'aNamespace',
                        operations: [
                            {name: 'operation', nameParams: [], params: [
                                {name: 'input', type: 'string'}
                            ], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
        });

        it('should return the nested service methods', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'child',
                        operations: [
                            {name: 'op2', nameParams: [], params: [], ret: {type: 'void'}}
                        ]
                    }
                ]
            });
        });

        it('should support service messages', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'aNamespace',
                        messages: [
                            {
                                name: 'aType',
                                members: [
                                    {name: 'prop', type: 'string'}
                                ]
                            }
                        ]
                    }
                ]
            });
        });
    });
});