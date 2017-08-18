import chai from 'chai';
import chaiSubset from 'chai-subset';
import runJsDoc from 'docworks-jsdoc2spec';
import {readFromDir, saveToDir} from '../index';
import fs from 'fs-extra';
import {dump} from './util';

chai.use(chaiSubset);
const expect = chai.expect;

function extractServices(path) {
  return runJsDoc({"include": [path],
    "includePattern": ".+\\.(js)?$",}).services;
}

describe.only('compare repo', function() {

  beforeEach(() => {
    return fs.remove('./tmp');
  });

  it('should report no change if there are no changes and return the repo', function() {
    let newVersion = extractServices('./test/compare/newVersion/noChange');
    let repoVersion = extractServices('./test/compare/repoVersion/noChange');

    return saveToDir('./tmp/newVersion/noChange', newVersion)
      .then(() => saveToDir('./tmp/repoVersion/noChange', repoVersion))
      .then(() => expect(newVersion).to.deep.equal(repoVersion));
  });

});
