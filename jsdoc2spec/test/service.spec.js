
import runner from '../lib/jsdoc-runner';


describe('docs', function() {
    describe('service', function() {
        it('should return the service members', function() {
            runner();
        });
    });
});