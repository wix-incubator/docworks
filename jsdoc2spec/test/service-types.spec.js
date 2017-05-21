import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import {inspect} from 'util';
const expect = chai.expect;
chai.use(chaiSubset);

chai.Assertion.addMethod('hasError', function(error) {
    if (!this._obj)
        throw new Error('expected hasError to get an array of errors');
    let found = this._obj.find((_) => _.message.indexOf(error) >=0);
    this.assert(
        !!found,
        `expected errors to contain an error with ${error}\nErrors:\n${inspect(this._obj, {colors: true, depth: 5})}`,
        `expected errors to not contain an error with ${error}\nErrors:\n${inspect(this._obj, {colors: true, depth: 5})}`
    );
});

describe('docs', function() {
    describe('service types', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/service-types.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it.only('should support string type', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'aString', get: true, set: false, type: 'string'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).not.hasError('Property aString');
        });

        it('should support number type', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'aNumber', get: true, set: false, type: 'number'}
                        ]
                    }
                ]
            });
        });

        it('should support boolean type', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'aBoolean', get: true, set: false, type: 'boolean'}
                        ]
                    }
                ]
            });
        });

        it('should support date type', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'aDate', get: true, set: false, type: 'Date'}
                        ]
                    }
                ]
            });
        });

        it('should support union type defined as string | number', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'union', get: true, set: false, type: ['string', 'number']}
                        ]
                    }
                ]
            });
        });

        it('should support array type defined as string[]', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'anArray', get: true, set: false, type: 'Array.<string>'}
                        ]
                    }
                ]
            });
        });

        it('should support array type defined as Array.<string>', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        properties: [
                            {name: 'anArray2', get: true, set: false, type: 'Array.<string>'}
                        ]
                    }
                ]
            });
        });

        it('should support multi-dimentional arrays', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        operations: [
                            {name: 'multiDimArray', nameParams: [], params: [], ret: 'Array.<Array.<string>>'}
                        ]
                    }
                ]
            });
        });

        it('should support Promise of array', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceTypes',
                        operations: [
                            {name: 'promiseArray', nameParams: [], params: [], ret: 'Promise.<Array.<string>>'}
                        ]
                    }
                ]
            });
        });

    });
});