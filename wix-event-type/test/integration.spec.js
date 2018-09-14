import runJsDoc from 'docworks-jsdoc2spec';
import {merge} from 'docworks-repo';
import runTern from 'docworks-tern';
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
    it('should load the eventType and add it to the service to the more members', function() {
      let jsDocRes = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      expect(jsDocRes).to.containSubset({
        services: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation',
                docs: {
                  summary: 'an operation'
                },
                extra: {
                  eventType: 'onClick'
                }
              }
            ]
          }
        ]
      });
    });
  });

  describe('merge', function() {
    it('should detect changed eventType', function() {
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);
      let newRepo = runJsDoc(SOURCE_integration2_SERVICE, ['src/index']);

      let mergeResult = merge(newRepo.services, repo.services, ['src/index']);

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation has changed extra.eventType']);

      expect(mergeResult).to.containSubset({
        repo: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation',
                docs: {
                  summary: 'an operation'
                },
                extra: {
                  eventType: 'dataChange'
                }
              }
            ]
          }
        ]
      });
    });

    it('should detect added eventType', function() {
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);
      let newRepo = runJsDoc(SOURCE_integration2_SERVICE, ['src/index']);

      let mergeResult = merge(newRepo.services, repo.services, ['src/index']);

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation2 has changed extra.eventType']);

      expect(mergeResult).to.containSubset({
        repo: [
          {name: 'Service', memberOf: 'aNamespace',
            operations: [
              { name: 'operation2',
                docs: {
                  summary: 'an operation'
                },
                extra: {
                  eventType: 'rowSelect'
                }
              }
            ]
          }
        ]
      });
    });
  });

  describe('tern', function() {
    it('should add eventType to tern', function() {
      let repo = runJsDoc(SOURCE_integration_SERVICE, ['src/index']);

      let tern = runTern(repo.services, 'http://base.com', 'api', [require('../src/index')]);

      expect(tern).to.contain(`"!eventType": "onClick"`);
    })
  })
});
