import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe.only('service', function() {
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
                        location: 'service-properties.js (35)'
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
                        location: 'service-properties.js (43, 52)'
                    }
                ]
            });
        });

    });
});