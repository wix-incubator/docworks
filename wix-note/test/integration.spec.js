import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

describe('integration test', function() {
  it('should load the note and add it to the service to the more members', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['src/index']);



    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            { name: 'operation',
              srcDocs: {
                summary: 'an operation'
              },
              more: {
                notes: ['this is a note about the member']
              }
            }
          ]
        }
      ]
    });
  });

  it('should load multiple notes add them to the service to the more members', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/integration.service.js"
      ],
    }, ['src/index']);



    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            { name: 'operation',
              srcDocs: {
                summary: 'an operation'
              },
              more: {
                notes: ['this is a note about the member', 'this is a second note']
              }
            }
          ]
        }
      ]
    });
  });

});
