import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe.only('ES6 Support', function() {
  let jsDocRes;
  beforeEach(() => {
    jsDocRes = runJsDoc({
      "include": [
        "test/es6code.js"
      ]
    },
      ['.']);
  });

  afterEach(function(){
    if (this.currentTest.state == 'failed') {
      console.log('the jsDocRes:');
      console.log(require('util').inspect(jsDocRes, {colors: true, depth: 9}));
    }
  });

  it('should support async functions', function() {

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'ES6Code', memberOf: 'aNamespace',
          operations: [
            {name: 'doSomething', nameParams: [], params: [], ret: {type: {name: 'Promise', typeParams: ['string']}}}
          ]
        }
      ]
    });
  });

  it('should support a function with spread operator ...', function() {

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'ES6Code', memberOf: 'aNamespace',
          operations: [
            {name: 'concatArrays', nameParams: [], params: [
              {name: 'arr', type: 'Array'},
              {name: 'arr2', type: 'Array'}
            ], ret: {type: 'Array'}}
          ]
        }
      ]
    });
  });

});