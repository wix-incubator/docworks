import runJsDoc from '../lib/jsdoc-runner';
import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

describe('jsdoc plugins', function() {
  it('run with plugin', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/service-plugin.js"
      ],
    }, ['./test/jsdoc-plugin']);

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            {name: 'operation', docs: {summary: 'this is another new summary'}}
          ],
          properties: [
            {name: 'label', docs: {summary: 'this is the new summary'}}
          ]
        }
      ]
    });

  })
});
