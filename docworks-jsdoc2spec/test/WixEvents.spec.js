import runJsDoc from '../lib/jsdoc-runner';
import {dump} from '../lib/util';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('e2e', function() {
  describe('WixEvents', function() {
    let jsDocRes;
    beforeEach(() => {
      jsDocRes = runJsDoc({
        "include": [
          "test/WixEvents.js"
        ]
      });
    });

    afterEach(function(){
      if (this.currentTest.state == 'failed') {
        console.log('the jsDocRes:');
        dump(jsDocRes);
      }
    });


    it('should return the $w.Event service', function() {

      expect(jsDocRes).to.containSubset({
        services: [
          {name: 'Event', memberOf: '$w'}
        ]
      });
    });

    it('should return the $w.Event service properties', function() {

      expect(jsDocRes).to.containSubset({
        services: [ {
          name: 'Event',
          memberOf: '$w',
          properties: [
            {name: 'target', type: '$w.Element'},
            {name: 'type', type: 'external:String'},
            {name: 'context', type: 'external:Object'},
          ]
        }]
      });
    });
    
  });
});
