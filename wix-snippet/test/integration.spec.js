import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import {merge} from 'docworks-repo';
import chaiSubset from 'chai-subset';
import {setSnippetsDir} from '../src/index';

const expect = chai.expect;
chai.use(chaiSubset);

const SOURCE_integration_SERVICE = {
  "include": [
    "test/integration.service.js"
  ],
};
const SOURCE_integration2_SERVICE = {
  "include": [
    "test/integration2.service.js"
  ],
};



describe('integration test', function() {
  describe('runJsDoc', function() {
    it('should load the example, adding it to the processed service', function () {
      setSnippetsDir('./test');
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'Service', memberOf: 'aNamespace',
            operations: [
              {
                name: 'operation', docs: {
                summary: 'an operation',
                examples: [{title: 'The example', body: 'function example() {\n  console.log(\'hi\');\n}'}]
              }
              }
            ]
          }
        ]
      });

    });

    it('should load an example with a description, adding it to the processed service', function () {
      setSnippetsDir('./test');
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'Service', memberOf: 'aNamespace',
            operations: [{
              name: 'operation2',
              docs: {
                summary: 'an operation 2',
                examples: [{
                  title: 'The example',
                  body: '<description>this is the example description</description>\nfunction example() {\n  console.log(\'hi\');\n}',
                  extra: {
                    description: {
                      description: 'this is the example description',
                      body: 'function example() {\n  console.log(\'hi\');\n}'
                    }
                  }
                }]
              }
              }
            ]
          }
        ]
      });

    });

    it('should report error if snippet dir not set', function () {
      setSnippetsDir(undefined);
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);


      expect(jsDocRes).to.containSubset({
        errors: [{message: 'ERROR: The Wix Snippet jsdoc plugin requires a configuration of snippets dir'}]
      });

    })
  });

  describe('merge', function() {
    it('should detect changed description', function() {
      setSnippetsDir('./test');
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);
      let newRepo = runJsDoc(SOURCE_integration2_SERVICE, ['src/index']);

      let mergeResult = merge(newRepo.services, repo.services, ['src/index']);

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation2.examples[0] has changed extra.description']);

      expect(mergeResult).to.containSubset({
        repo: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation2',
                docs: {
                  summary: 'an operation 2',
                  examples: [{
                    title: 'The example',
                    body: '<description>this is a different description</description>\nfunction example() {\n  console.log(\'hi\');\n}',
                    extra: {
                      description: {
                        description: 'this is a different description',
                        body: 'function example() {\n  console.log(\'hi\');\n}'
                      }
                    }
                  }]
                }
              }
            ]
          }
        ]
      });
    });

  })

});
