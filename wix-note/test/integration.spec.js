import runJsDoc from 'docworks-jsdoc2spec';
import {merge} from 'docworks-repo';
import chai from 'chai';
import chaiSubset from 'chai-subset';

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
    it('should load the note and add it to the service to the more members', function() {
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      expect(jsDocRes).to.containSubset({
        services: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation',
                srcDocs: {
                  summary: 'an operation'
                },
                extra: {
                  notes: ['this is a note about the member']
                }
              }
            ]
          }
        ]
      });
    });

    it('should load multiple notes add them to the service to the more members', function() {
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      expect(jsDocRes).to.containSubset({
        services: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation2',
                srcDocs: {
                  summary: 'an operation'
                },
                extra: {
                  notes: ['this is a note about the member', 'this is a second note']
                }
              }
            ]
          }
        ]
      });
    });
  });

  describe('merge', function() {
    it('should detect changed note', function() {
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);
      let newRepo = runJsDoc(SOURCE_integration2_SERVICE, ['src/index']);

      let mergeResult = merge(newRepo.services, repo.services, ['src/index']);

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation has changed extra.notes']);

      expect(mergeResult).to.containSubset({
        repo: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation',
                srcDocs: {
                  summary: 'an operation'
                },
                extra: {
                  notes: ['this note has changed']
                }
              }
            ]
          }
        ]
      });
    });

    it('should detect added note', function() {
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);
      let newRepo = runJsDoc(SOURCE_integration2_SERVICE, ['src/index']);

      let mergeResult = merge(newRepo.services, repo.services, ['src/index']);

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation2 has changed extra.notes']);

      expect(mergeResult).to.containSubset({
        repo: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation2',
                srcDocs: {
                  summary: 'an operation'
                },
                extra: {
                  notes: ['this is a note about the member', 'this is a second note', 'this is a new note']
                }
              }
            ]
          }
        ]
      });
    });
  })
});
