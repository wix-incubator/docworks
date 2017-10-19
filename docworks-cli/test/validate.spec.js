import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';

import validate from '../src/validate';

chai.use(chaiSubset);
const expect = chai.expect;

const valid = './test/valid';
const invalid = './test/invalid';

let log = [];
const logger = {
  log: (_) => log.push(_),
  error: (_) => log.push(_),
  success: (_) => log.push(_)
};


describe('validate workflow', function() {

  beforeEach(() => {
    log = [];
    return fs.remove('./tmp');
  });

  afterEach(function(){
    // console.log(this.currentTest)
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack;
      let lines = stack.split('\n');
      lines.splice(1, 0, ...log);
      this.currentTest.err.stack = lines.join('\n');
    }
  });

  it('should report valid for valid jsDocs', async function() {
    let isValid = validate({"include": valid, "includePattern": ".+\\.(js)?$"}, logger);

    expect(isValid).to.be.true;
    expect(log).to.containSubset(['jsDoc ok']);
  });

  it('should report invalid for invalid jsDocs', async function() {
    let isValid = validate({"include": invalid, "includePattern": ".+\\.(js)?$"}, logger);

    expect(isValid).to.be.false;
    expect(log).to.containSubset(['jsDoc errors detected']);
  });

});
