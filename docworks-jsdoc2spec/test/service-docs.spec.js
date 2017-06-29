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
                    "test/service-docs.js"
                ]
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') {
                console.log('the jsDocRes:');
                dump(jsDocRes);
            }
        });


        it.only('should support docs on a property', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceDocs',
                        properties: [
                            {name: 'propertyWithDocs', get: true, set: false, type: 'string',
                                docs: {
                                    summary: 'the summary for propertyWithDocs',
                                    description: 'the description for propertyWithDocs\nanother line of description',
                                    links: ["aNamespace.ServiceProperties a related service",
                                        "{@link aNamespace.ServiceOperations) another related service",
                                        "{@link http://somedomain.com} a related site"]
                                }
                            }
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Property readOnly');
        });

    });
});