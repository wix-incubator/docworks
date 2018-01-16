import chai from 'chai';
import chaiSubset from 'chai-subset';
import {propTern, typeTern} from '../lib/tern-generator';

chai.use(chaiSubset);
const expect = chai.expect;

function urlGenerator(service, member) {
  return `http://www.wix.com/reference/${service}.html#${member}`;
}

describe('generate tern', function() {

  describe('for type', function() {

    it('string', function() {
      expect(typeTern('string')).to.equal('string');
    });

    it('Array<String>', function() {
      expect(typeTern({name: 'Array', typeParams: ['string']})).to.equal('[string]');
    });

    it('boolean', function() {
      expect(typeTern('boolean')).to.equal('bool');
    });

    it('number', function() {
      expect(typeTern('number')).to.equal('number');
    });

    it('Object', function() {
      expect(typeTern('Object')).to.equal('obj');
    });

//    Date
//    Function
//    Promise

  });

  describe('for properties', function() {
    let service = require('./services/properties.json');

    it('read-only property', function() {
      let prop = service.properties.find(_ => _.name === 'prop1');

      let tern = propTern(service, prop, urlGenerator);

      expect(tern).to.containSubset({
        "prop1": {
          "!type": "string",
          "!doc": "Summary of prop 1",
          "!url": "http://www.wix.com/reference/properties.html#prop1"
        } } );
    });

    it('read-write property', function() {
      let prop = service.properties.find(_ => _.name === 'prop2');

      let tern = propTern(service, prop, urlGenerator);

      expect(tern).to.containSubset({
        "prop2": {
          "!type": "string",
          "!doc": "Summary of prop 2",
          "!url": "http://www.wix.com/reference/properties.html#prop2"
        } } );
    });

    it('array property', function() {
      let prop = service.properties.find(_ => _.name === 'arrayProp');

      let tern = propTern(service, prop, urlGenerator);

      expect(tern).to.containSubset({
        "arrayProp": {
          "!type": "[string]",
          "!doc": "Summary of arrayProp",
          "!url": "http://www.wix.com/reference/properties.html#arrayProp"
        } } );
    });
  });

});
