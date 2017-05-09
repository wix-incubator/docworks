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


        it('should support string type', function() {
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

    });
});