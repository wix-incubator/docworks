
import runner from '../lib/jsdoc-runner';
import serviceModel from '../lib/services-model';


describe('docs', function() {
    describe('service', function() {
        it('should return the service members', function() {
            let services = runner({
                "include": [
                    "test/service.js"
                ],
                "includePattern": ".+\\.(js|jsdoc|es6|jsw)?$",
                "excludePattern": "(^|\\/|\\\\)_"
            });

            console.log(services);
        });
    });
});