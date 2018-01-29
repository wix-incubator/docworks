import chai from 'chai';
import chaiSubset from 'chai-subset';
import {propTern, typeTern, operationTern, messageTern, ternService} from '../lib/tern-generator';

chai.use(chaiSubset);
const expect = chai.expect;

function urlGenerator(service, member) {
  let serviceFullName = service.memberOf?`${service.memberOf}.${service.name}`:service.name;
  if (member)
    return `http://www.wix.com/reference/${serviceFullName}.html#${member}`;
  else
    return `http://www.wix.com/reference/${serviceFullName}.html`;
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
    let findCallback = function() {return undefined};

    it('func(): void', function() {
      let operation = service.operations.find(_ => _.name === 'resetValidityIndication');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "resetValidityIndication": {
          "!type": "fn()",
          "!doc": "Resets the element's visual validity indication.",
          "!url": "http://www.wix.com/reference/functions.html#resetValidityIndication"
        } } );
    });

    it('func(string): void', function() {
      let operation = service.operations.find(_ => _.name === 'to');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "to": {
          "!type": "fn(url: string)",
          "!doc": "Directs the browser to navigate to the specified URL.",
          "!url": "http://www.wix.com/reference/functions.html#to"
        } } );
    });

    it('func(string, object): Promise<Object>', function() {
      let operation = service.operations.find(_ => _.name === 'openLightbox');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "openLightbox": {
          "!type": "fn(name: string, data: obj) -> +Promise[value=obj]",
          "!doc": "Opens a lightbox and optionally passes it the given data.",
          "!url": "http://www.wix.com/reference/functions.html#openLightbox"
        } } );
    });

    it('func(Number, Number): Promise<void>', function() {
      let operation = service.operations.find(_ => _.name === 'scrollBy');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "scrollBy": {
          "!type": "fn(x: number, y: number) -> +Promise[value=+void]",
          "!doc": "Scrolls the page by a given number of pixels.",
          "!url": "http://www.wix.com/reference/functions.html#scrollBy"
        } } );
    });
  });

  describe('for callbacks', function() {
    let service = require('./services/callbacks.json');
    let findCallback = function(aType) {
      if (aType === 'callbacks.EventHandler')
        return service.callbacks.find(_ => _.name === 'EventHandler');
      if (aType === 'callbacks.EventHandler2')
        return service.callbacks.find(_ => _.name === 'EventHandler2');
    };

    it('func(func(): void): Element', function() {
      let operation = service.operations.find(_ => _.name === 'onViewportEnter');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "onViewportEnter": {
          "!type": "fn(handler: fn()) -> +$w.Element",
          "!doc": "Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.",
          "!url": "http://www.wix.com/reference/callbacks.html#onViewportEnter"
        } } );
    });

    it('func(func(Event, $w): number): Element', function() {
      let operation = service.operations.find(_ => _.name === 'onViewportEnter2');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "onViewportEnter2": {
          "!type": "fn(handler: fn(event: +Event, $w: +$w.$w) -> number) -> +$w.Element",
          "!doc": "Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.",
          "!url": "http://www.wix.com/reference/callbacks.html#onViewportEnter2"
        } } );
    });
  });

  describe('for messages', function() {
    let service = require('./services/messages.json');

    it('Dropdown.Options', function() {
      let message = service.messages.find(_ => _.name === 'Option');

      let tern = messageTern(service, message, urlGenerator);

      expect(tern).to.containSubset({
        "Option": {
          "!doc": "An object used by the `options` property that contains the attributes of a dropdown list item.",
          "!url": "http://www.wix.com/reference/$w.Dropdown.html#Option",
          "label": {
            "!type": "string",
            "!doc": "The label of the dropdown option. This is what a user sees.",
            "!url": "http://www.wix.com/reference/$w.Dropdown.html#Option"
          },
          "value": {
            "!type": "string",
            "!doc": "The value of the dropdown option. This is what you use in code and is what is stored in your collections.",
            "!url": "http://www.wix.com/reference/$w.Dropdown.html#Option"
          }
        }
      });
    });
  });

  describe('for a service', function() {
    let service = require('./services/collapsedMixin.json');

    it('CollapsedMixin', function() {
      let tern = ternService(service, urlGenerator);

      expect(tern).to.containSubset({
        "$w": {
          "CollapsedMixin": {
            "!doc": "Provides functionality for elements that can be collapsed.\n\n To learn about the behavior of a collapsed element,\n see the [`collapsed`](#collapsed) property.",
            "!url": "http://www.wix.com/reference/$w.CollapsedMixin.html",
            "prototype": {
              "collapse": {
                "!type": "fn() -> +Promise[value=+void]",
                "!doc": "Collapses the element and sets its `collapsed` property to `true`.",
                "!url": "http://www.wix.com/reference/$w.CollapsedMixin.html#collapse"
              },
              "expand": {
                "!type": "fn() -> +Promise[value=+void]",
                "!doc": "Expands the element and sets its `collapsed` property to `false`.",
                "!url": "http://www.wix.com/reference/$w.CollapsedMixin.html#expand"
              },
              "collapsed": {
                "!type": "bool",
                "!doc": "Indicates if the element is collapsed or expanded.",
                "!url": "http://www.wix.com/reference/$w.CollapsedMixin.html#collapsed"
              }
            }
          }
        },
      });
    })
  });
});
