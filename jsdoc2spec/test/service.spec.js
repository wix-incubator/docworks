
import runner from '../lib/jsdoc-runner';


describe('docs', function() {
    describe('service', function() {
        it('should return the service members', function() {
            runner({
                "include": [
                    "test/service.js"
                ],
                "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
                "excludePattern": "(^|\\/|\\\\)_"
            });
        });
    });
});