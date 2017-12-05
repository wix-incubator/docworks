import runJsDoc from 'docworks-jsdoc2spec';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);


describe('integration test', function() {

  let jsDocRes = runJsDoc({
    "include": [
      "test/types.service.js"
    ],
  }, ['src/index']);

  it('should have no errors', function() {
    expect(jsDocRes.errors).to.be.deep.equal([]);
  });

  it('should rename property types with prefix external: to the native type name', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          properties:
            [ { name: 'label',
              type: 'string' },
              { name: 'valid',
                type: 'boolean' } ]
        } ] } );

  });

  it('should rename operation types with prefix external: to the native type name', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          operations:
            [ { name: 'onEvent',
                params:
                  [ { name: 'event',
                      type: 'Service.Event' } ] },
              { name: 'aFunction',
                params:
                  [ { name: 'param',
                      type: 'string' } ],
                ret: { type: 'number'} } ]
       } ] } );

  });

  it('should rename callback types with prefix external: to the native type name', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          callbacks:
            [ { name: 'Event',
              params:
                [ { name: 'value',
                  type: [ 'string', 'boolean' ] },
                  { name: 'reject',
                    type: 'Function' }] } ]
        } ] } );

  });

  it('should rename message types with prefix external: to the native type name', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          messages:
            [ { name: 'aType',
              members:
                [ { name: 'boolProp',
                  type: 'boolean' },
                  { name: 'stringProp',
                    type: 'string' } ] } ]
        } ] } );

  });

  it('should rename external:Date to the Date', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          properties:
            [ { name: 'date',
              type: 'Date' } ]
        } ] } );

  });

  it('should rename external:Number|$w.Slide to the number|$w.Slide', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          properties:
            [ { name: 'union',
              type: ['number','Service.aType'] } ]
        } ] } );

  });

  it('should rename external:String[] to Array.<string>', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          properties:
            [ { name: 'array',
              type: {name: 'Array', typeParams: ['string'] } } ]
        } ] } );

  });

  it('should rename external:Promise to Promise<>, incorporating the @reject and @fulfill tags', function() {

    expect(jsDocRes).to.containSubset({
      services:
        [ { name: 'Service',
          operations:
            [ { name: 'anAsyncFunction',
                ret: {
                  type: {name: 'Promise', typeParams: ['string'] },
                  doc: 'abcd. on fulfilled - fulfill docs. on rejected - error docs' } } ]
        } ] } );

  });
});
