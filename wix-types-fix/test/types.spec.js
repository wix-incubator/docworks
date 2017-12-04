import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);


describe('integration test', function() {
  it('should rename all types with prefix external: to the native type name', function() {
    let jsDocRes = runJsDoc({
      "include": [
        "test/types.service.js"
      ],
    }, ['./index']);


    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          properties:
            [ { name: 'label',
                type: 'string' },
              { name: 'valid',
                type: 'boolean' } ],
          operations:
            [ { name: 'onEvent',
                params:
                  [ { name: 'event',
                      type: 'Service.Event' } ] },
              { name: 'aFunction',
                params:
                  [ { name: 'param',
                      type: 'string' } ],
                ret: { type: 'number'} } ],
          callbacks:
            [ { name: 'Event',
              params:
                [ { name: 'value',
                    type: [ 'string', 'boolean' ] },
                  { name: 'reject',
                    type: 'Function' }] } ],
          messages:
            [ { name: 'aType',
              members:
                [ { name: 'boolProp',
                    type: 'boolean' },
                  { name: 'stringProp',
                    type: 'string' } ] } ]
       } ] } );

    expect(jsDocRes.errors).to.be.empty;
  });
});
