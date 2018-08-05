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
    }, ['./test/docworks-plugin']);

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            { name: 'operation', srcDocs: {summary: 'this is another new summary'},
              extra: {pluginGenerated: 'operation plugin visited'}}
          ],
          properties: [
            { name: 'label', srcDocs: {summary: 'this is the new summary'},
              extra: {pluginGenerated: 'property plugin visited'}}
          ],
          messages: [
            { name: 'InMessage',
              extra: {pluginGenerated: 'message plugin visited'}}
          ],
          extra: {pluginGenerated: 'service plugin visited'}
        }
      ]
    });

  })
});
