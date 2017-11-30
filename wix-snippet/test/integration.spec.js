import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import {setSnippetsDir} from '../index';

const expect = chai.expect;
chai.use(chaiSubset);


setSnippetsDir('./test');

describe('integration test', function() {
  it('should load the example, adding it to the processed service', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['./index']);



    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            {name: 'operation', srcDocs: {
              summary: 'an operation',
              examples: [{title: 'The example', body: 'function example() {\n  console.log(\'hi\');\n}'}]
            }}
          ]
        }
      ]
    });

  })
});
