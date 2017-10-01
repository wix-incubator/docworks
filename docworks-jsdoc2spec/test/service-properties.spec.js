import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('service properties', function() {
        let jsDocRes;
        beforeEach(() => {
            jsDocRes = runJsDoc({
                "include": [
                    "test/service-properties.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it('should support readonly property', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            {name: 'readOnly', get: true, set: false, type: 'string'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Property readOnly');
        });

        it('should not allow writeonly properties', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            {name: 'writeOnly', get: false, set: true, type: 'string'}
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property writeOnly is a write only property',
                        location: 'service-properties.js (18)'
                    }
                ]
            });
        });

        it('should merge get and set members declaration into a single property', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            {name: 'label', get: true, set: true, type: 'string'}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Property label');
        });

        it('should error on missing type', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            { name: 'missingType', get: false, set: false, type: 'void' }
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property missingType is missing a type annotation',
                        location: 'service-properties.js (44)'
                    }
                ]
            });
        });

        it('should error on mismatched type between get and set', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            { name: 'missMatchType', get: true, set: true, type: 'string' }
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property missMatchType has mismatching types for get (string) and set (number)',
                        location: 'service-properties.js (52, 61)'
                    }
                ]
            });
        });

        it('should error on duplicate property definition', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            { name: 'dumplicate', get: true, set: true, type: 'string' }
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property dumplicate is defined two or more times',
                        location: 'service-properties.js (69, 78)'
                    }
                ]
            });
        });

        it('should error on duplicate 3 times property definition', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceProperties',
                        properties: [
                            { name: 'dumplicate2', get: true, set: false, type: 'string' }
                        ]
                    }
                ],
                errors: [
                    {
                        message: 'Property dumplicate2 is defined two or more times',
                        location: 'service-properties.js (87, 96, 105)'
                    }
                ]
            });
        });
    });
});