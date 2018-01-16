import chai from 'chai';
import chaiSubset from 'chai-subset';
import {propTern, typeTern, operationTern} from '../lib/tern-generator';

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

    it('Date', function() {
      expect(typeTern('Date')).to.equal('+Date');
    });

    it('$w.Element', function() {
      expect(typeTern('$w.Element')).to.equal('+$w.Element');
    });

    it('Promise<obj>', function() {
      expect(typeTern({name: "Promise", typeParams: [ "Object" ]})).to.equal('+Promise[value=obj]');
    });

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

  describe('for functions', function() {
    let service = require('./services/functions.json');

    it('func(): void', function() {
      let operation = service.operations.find(_ => _.name === 'resetValidityIndication');

      let tern = operationTern(service, operation, urlGenerator);

      expect(tern).to.containSubset({
        "resetValidityIndication": {
          "!type": "fn()",
          "!doc": "Resets the element's visual validity indication.",
          "!url": "http://www.wix.com/reference/functions.html#resetValidityIndication"
        } } );
    });

    it('func(string): void', function() {
      let operation = service.operations.find(_ => _.name === 'to');

      let tern = operationTern(service, operation, urlGenerator);

      expect(tern).to.containSubset({
        "to": {
          "!type": "fn(url: string)",
          "!doc": "Directs the browser to navigate to the specified URL.",
          "!url": "http://www.wix.com/reference/functions.html#to"
        } } );
    });

    it('func(string, object): void', function() {
      let operation = service.operations.find(_ => _.name === 'openLightbox');

      let tern = operationTern(service, operation, urlGenerator);

      expect(tern).to.containSubset({
        "openLightbox": {
          "!type": "fn(name: string, data: obj) -> +Promise[value=obj]",
          "!doc": "Opens a lightbox and optionally passes it the given data.",
          "!url": "http://www.wix.com/reference/functions.html#openLightbox"
        } } );
    });

  });
});
