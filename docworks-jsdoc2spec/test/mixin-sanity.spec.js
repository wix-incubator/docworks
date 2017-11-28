import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('docs', function() {
  describe('mixins', function() {
    let jsDocRes;
    beforeEach(() => {
      jsDocRes = runJsDoc({
        "include": [
          "test/mixin-sanity.js"
        ]
      });
    });

    afterEach(function(){
      if (this.currentTest.state == 'failed') {
        console.log('the jsDocRes:');
        dump(jsDocRes);
      }
    });

    it('should return the service for each mixin', function() {

      expect(jsDocRes).to.containSubset({
        services: [
          {name: 'aMixin', memberOf: 'aNamespace'}
        ]
      });
    });

    it('should mixin as a service', function() {

      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'aMixin',
            operations: [
              {name: 'operation', nameParams: [], params: [
                {name: 'input', type: 'string'}
              ], ret: {type: 'void'}}
            ]
          }
        ]
      });
    });

    it('should return the service with mixes indicator', function() {

      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'aMixes',
            mixes: ['aNamespace.aMixin'],
          }
        ]
      });
    });

    it('should not include the mixin operations in the mixes service', function() {

      let aMixes = jsDocRes.services.find(_ => _.name === 'aMixes');
      expect(aMixes).to.not.containSubset({
        operations: [
          {name: 'operation'}
        ]
      });
    });

    it('should not include the mixin properties in the mixes service', function() {

      let aMixes = jsDocRes.services.find(_ => _.name === 'aMixes');
      expect(aMixes).to.not.containSubset({
        properties: [
          {name: 'readOnly'}
        ]
      });
    });

    it('should not include the mixin messages in the mixes service', function() {

      let aMixes = jsDocRes.services.find(_ => _.name === 'aMixes');
      expect(aMixes).to.not.containSubset({
        messages: [
          {name: 'InMessage'}
        ]
      });
    });

    it('should not include the mixin callbacks in the mixes service', function() {

      let aMixes = jsDocRes.services.find(_ => _.name === 'aMixes');
      expect(aMixes).to.not.containSubset({
        callbacks: [
          {name: 'aCallback'}
        ]
      });
    });

  });
});