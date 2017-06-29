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


        it('should support docs on a property', function() {

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
            expect(jsDocRes.errors).to.not.deep.contains('Property propertyWithDocs');
        });

        it('should use the docs from the getter for read-write properties', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceDocs',
                        properties: [
                            {name: 'label', get: true, set: true, type: 'string',
                                docs: {
                                    summary: 'summary from the getter',
                                    description: 'desc from the getter',
                                    links: []
                                }
                            }
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Property label');
        });

        it('should support docs on an operation', function() {
            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceDocs',
                        operations: [
                            {name: 'operationWithDocs',
                            docs: {
                                summary: 'an operation',
                                description: 'the description of the operation',
                                links: []
                            }}
                        ]
                    }
                ]
            });
            expect(jsDocRes.errors).to.not.deep.contains('Operation operationWithDocs');
        });

        it('should support docs on a messages', function() {

            expect(jsDocRes).to.containSubset({
                services: [
                    {
                        name: 'ServiceDocs',
                        messages: [
                            {
                                name: 'MessageWithDocs',
                                docs: {
                                    summary: 'a Message with docs',
                                    description: 'the description of the message',
                                    links: []
                                }
                            }
                        ]
                    }
                ]
            });
        });

    });
});