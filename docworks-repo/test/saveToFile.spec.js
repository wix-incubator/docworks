import chai from 'chai';
import chaiFiles from 'chai-files';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir} from '../index';
import fs from 'fs-extra';

chai.use(chaiFiles);
const expect = chai.expect;
const file = chaiFiles.file;
const dir = chaiFiles.dir;


describe('saveToFiles', function() {
    beforeEach(() => {
        return fs.remove('tmp');
    });

    it('should save all services to files', function() {
        let jsDocRes = runJsDoc({
            "include": [
                "test/sources/"
            ],
            "includePattern": ".+\\.(js)?$",
        });
        return saveToDir('tmp', jsDocRes.services)
          .then(() => {
              expect(dir('tmp/aNamespace')).to.exist;
              expect(file('tmp/aNamespace.service.json')).to.exist;
              expect(file('tmp/aNamespace/aMixes.service.json')).to.exist;
              expect(file('tmp/aNamespace/child.service.json')).to.exist;
              expect(file('tmp/aNamespace/Service.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceCallbacks.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceDocs.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceMessages.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceOperations.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceProperties.service.json')).to.exist;
              expect(file('tmp/aNamespace/ServiceTypes.service.json')).to.exist;
          });
    });

});
