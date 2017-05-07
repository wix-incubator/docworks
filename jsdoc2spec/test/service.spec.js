import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
    describe('service', function() {
        it('should return the service members', function() {
            let services = runJsDoc({
                "include": [
                    "test/service.js"
                ],
                "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
                "excludePattern": "(^|\\/|\\\\)_"
            });

            dump(services);

            expect(services).to.containSubset({
                services:
                    [
                        {
                            name: 'Service',
                            properties: [{name: 'label', get: true, set: true, type: 'string'}]
                        }
                    ]
            });

        });
    });
});