import chai from 'chai';
import chaiFiles from 'chai-files';
import chaiSubset from 'chai-subset';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir} from '../index';
import fs from 'fs-extra';
import {dump} from './util';

chai.use(chaiFiles);
chai.use(chaiSubset);
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

  it('should read all services from files', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/sources/mixin-sanity.js"
      ],
      "includePattern": ".+\\.(js)?$",
    });
    return saveToDir('tmp', jsDocRes.services)
      .then(() => readFromDir('./tmp'))
      .then((readModel) => {
        jsDocRes.services.forEach((ser1) => {
          let ser2 = readModel.services
            .find((ser2) => ser2.name === ser1.name);
          expect(ser1).to.containSubset(ser2);
        });
      });
  });

});
