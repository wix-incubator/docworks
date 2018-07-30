import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('ES6 Support', function() {
  let jsDocRes;
  beforeEach(() => {
    jsDocRes = runJsDoc({
        "include": [
          "test/es6code.js"
        ]
      },
      ['.']);
  });

  afterEach(function () {
    if (this.currentTest.state == 'failed') {
      console.log('the jsDocRes:');
      console.log(require('util').inspect(jsDocRes, {colors: true, depth: 9}));
    }
  });

  it('should support async functions', function () {

    expect(jsDocRes).to.containSubset({
      services: [
        {
          name: 'ES6Code', memberOf: 'aNamespace',
          operations: [
            {name: 'doSomething', nameParams: [], params: [], ret: {type: {name: 'Promise', typeParams: ['string']}}}
          ]
        }
      ]
    });
  });

  it('should support a function with spread operator ...', function () {

    expect(jsDocRes).to.containSubset({
      services: [
        {
          name: 'ES6Code', memberOf: 'aNamespace',
          operations: [
            {
              name: 'concatArrays', nameParams: [], params: [
              {name: 'arr', type: 'Array'},
              {name: 'arr2', type: 'Array'}
            ], ret: {type: 'Array'}
            }
          ]
        }
      ]
    });
  });
});

describe('Class comments', function() {
  let jsDocRes;
  beforeEach(() => {
    jsDocRes = runJsDoc({
        "include": [
          "test/box.js"
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


// skipped because of a bug in Babel - Babel removes comments from a class body that is empty (except for the comments)
  it.skip('should preserve comments in a class body even if the class body has no members', function() {

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Box', memberOf: '$w',
          properties: [
            {name: 'style'}
          ]
        }
      ]
    });
  });

});