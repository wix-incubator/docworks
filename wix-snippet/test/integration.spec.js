import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import {setSnippetsDir} from '../src/index';

const expect = chai.expect;
chai.use(chaiSubset);

describe('integration test', function() {
  it('should load the example, adding it to the processed service', function() {
    setSnippetsDir('./test');
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['src/index']);

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            {name: 'operation', docs: {
              summary: 'an operation',
              examples: [{title: 'The example', body: 'function example() {\n  console.log(\'hi\');\n}'}]
            }}
          ]
        }
      ]
    });

  });

  it('should load an example with a description, adding it to the processed service', function() {
    setSnippetsDir('./test');
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['src/index']);

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            {name: 'operation2', docs: {
              summary: 'an operation 2',
              examples: [{title: 'The example', body: '<description>this is the example description</description>\nfunction example() {\n  console.log(\'hi\');\n}'}]
            }}
          ]
        }
      ]
    });

  })

  it('should report error if snippet dir not set', function() {
    setSnippetsDir(undefined);
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['src/index']);



    expect(jsDocRes).to.containSubset({
      errors: [{message: 'ERROR: The Wix Snippet jsdoc plugin requires a configuration of snippets dir'}]
    });

  })

});
