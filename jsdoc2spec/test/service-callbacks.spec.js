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
                            ], ret: 'Promise.<string>'},
                            {name: 'aComplexCallbackCallback', nameParams: [], params: [
                                {name: 'z', type: 'number'}
                            ], ret: 'void'}
                        ]
                    }
                ]
            });
        });
    });
});