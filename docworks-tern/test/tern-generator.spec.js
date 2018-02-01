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
    let service = require('./services/properties.service.json');

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
    let service = require('./services/functions.service.json');
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

    it('func(Array<aType>): Promise<void>', function() {
      let operation = service.operations.find(_ => _.name === 'complexType');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "complexType": {
          "!type": "fn(x: [+aType]) -> +Promise[value=+void]",
          "!doc": "...",
          "!url": "http://www.wix.com/reference/functions.html#complexType"
        } } );
    });
  });

  describe('for callbacks', function() {
    let service = require('./services/callbacks.service.json');
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
          "!type": "fn(handler: callbacks.EventHandler) -> +$w.Element",
          "!doc": "Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.",
          "!url": "http://www.wix.com/reference/callbacks.html#onViewportEnter"
        } } );
    });

    it('func(func(Event, $w): number): Element', function() {
      let operation = service.operations.find(_ => _.name === 'onViewportEnter2');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "onViewportEnter2": {
          "!type": "fn(handler: callbacks.EventHandler2) -> +$w.Element",
          "!doc": "Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.",
          "!url": "http://www.wix.com/reference/callbacks.html#onViewportEnter2"
        } } );
    });

    it('callback(): void', function() {
      let operation = service.callbacks.find(_ => _.name === 'EventHandler');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "EventHandler": {
          "!type": "fn()",
          "!doc": "",
          "!url": "http://www.wix.com/reference/callbacks.html#EventHandler"
        } } );
    });

    it('callback(Event, $w): number', function() {
      let operation = service.callbacks.find(_ => _.name === 'EventHandler2');

      let tern = operationTern(service, operation, urlGenerator, findCallback);

      expect(tern).to.containSubset({
        "EventHandler2": {
          "!type": "fn(event: +Event, $w: +$w.$w) -> number",
          "!doc": "",
          "!url": "http://www.wix.com/reference/callbacks.html#EventHandler2"
        } } );
    });
    //
  });

  describe('for messages', function() {
    let service = require('./services/messages.service.json');

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
    let collapsedMixin = require('./services/collapsedMixin.service.json');
    let hiddenCollapsedMixin = require('./services/HiddenCollapsedMixin.service.json');
    let hiddenMixin = require('./services/HiddenMixin.service.json');
    let button = require('./services/button.service.json');
    let button2 = require('./services/button2.service.json');
    let dropdown = require('./services/dropdown.service.json');
    let wixStorage = require('./services/wix-storage.service.json');
    let parent = require('./services/parent.service.json');
    let child = require('./services/child.service.json');

    let findMixin = (fullName) => {
      if (fullName === '$w.CollapsedMixin')
        return collapsedMixin;
      if (fullName === '$w.HiddenMixin')
        return hiddenMixin;
      if (fullName === '$w.HiddenCollapsedMixin')
        return hiddenCollapsedMixin;
      if (fullName === '$w.parent')
        return parent;
    };

    it('CollapsedMixin', function() {
      let tern = ternService(collapsedMixin, urlGenerator);

      expect(tern).to.containSubset({
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
        },
      });
    });

    it('Button - with one mixin', function() {
      let tern = ternService(button, urlGenerator, () => {}, findMixin);

      expect(tern).to.containSubset({
        "Button": {
          "!doc": "A text button or an icon button.",
          "!url": "http://www.wix.com/reference/$w.Button.html",
          "prototype": {
            "label": {
              "!type": "string",
              "!doc": "Sets or gets the label of a text button.",
              "!url": "http://www.wix.com/reference/$w.Button.html#label"
            },
            "collapse": {
              "!type": "fn() -> +Promise[value=+void]",
              "!doc": "Collapses the element and sets its `collapsed` property to `true`.",
              "!url": "http://www.wix.com/reference/$w.Button.html#collapse"
            },
            "expand": {
              "!type": "fn() -> +Promise[value=+void]",
              "!doc": "Expands the element and sets its `collapsed` property to `false`.",
              "!url": "http://www.wix.com/reference/$w.Button.html#expand"
            },
            "collapsed": {
              "!type": "bool",
              "!doc": "Indicates if the element is collapsed or expanded.",
              "!url": "http://www.wix.com/reference/$w.Button.html#collapsed"
            }
          }
        },
      });
    });

    it('Button2 - with multiple recursive mixins', function() {
      let tern = ternService(button2, urlGenerator, () => {}, findMixin);

      expect(tern).to.containSubset({
        "Button2": {
          "!doc": "A text button or an icon button.",
          "!url": "http://www.wix.com/reference/$w.Button2.html",
          "prototype": {
            "label": {
              "!type": "string",
              "!doc": "Sets or gets the label of a text button.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#label"
            },
            "collapse": {
              "!type": "fn() -> +Promise[value=+void]",
              "!doc": "Collapses the element and sets its `collapsed` property to `true`.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#collapse"
            },
            "expand": {
              "!type": "fn() -> +Promise[value=+void]",
              "!doc": "Expands the element and sets its `collapsed` property to `false`.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#expand"
            },
            "collapsed": {
              "!type": "bool",
              "!doc": "Indicates if the element is collapsed or expanded.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#collapsed"
            },
            "hide": {
              "!type": "fn(animationName: string) -> +Promise[value=+void]",
              "!doc": "Hides the element and sets its `hidden` property\n to `true`, using an animation if specified.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#hide"
            },
            "show": {
              "!type": "fn(animationName: string) -> +Promise[value=+void]",
              "!doc": "Shows the element and sets its `hidden` property\n to `false`, using an animation if specified.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#show"
            },
            "hidden": {
              "!type": "bool",
              "!doc": "Indicates if the element is visible or hidden.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#hidden"
            },
            "isVisible": {
              "!type": "bool",
              "!doc": "Indicates if the element is actually visible.",
              "!url": "http://www.wix.com/reference/$w.Button2.html#isVisible"
            }
          }
        },
      });
    });

    it('Dropdown - with messages', function() {
      let tern = ternService(dropdown, urlGenerator, () => {}, findMixin);

      expect(tern).to.containSubset({
        "Dropdown": {
          "!doc": "...",
          "!url": "http://www.wix.com/reference/$w.Dropdown.html",
          "prototype": {
            "options": {
              "!type": "[+$w.Dropdown~Option]",
              "!doc": "Sets or gets the options in a dropdown.",
              "!url": "http://www.wix.com/reference/$w.Dropdown.html#options"
            },
            "placeholder": {
              "!type": "string",
              "!doc": "Sets or gets the dropdown's placeholder text.",
              "!url": "http://www.wix.com/reference/$w.Dropdown.html#placeholder"
            },
            "selectedIndex": {
              "!type": "number",
              "!doc": "Sets or gets the index of the selected option.",
              "!url": "http://www.wix.com/reference/$w.Dropdown.html#selectedIndex"
            }
          },
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
        },
      });
    });

    it('wix-storage - with messages', function() {
      let tern = ternService(wixStorage, urlGenerator, () => {}, findMixin);

      expect(tern).to.containSubset({
        "wix_storage": {
          "!doc": "The wix-storage module contains functionality for the persistent\n storage of key/value data in the user's browser.",
          "!url": "http://www.wix.com/reference/wix-storage.html",
          "prototype": {
            "local": {
              "!doc": "Used for local storage of data.",
              "!type": "+wix-storage.Storage",
              "!url": "http://www.wix.com/reference/wix-storage.html#local",
            },
            "session": {
              "!doc": "Used for session storage of data.",
              "!type": "+wix-storage.Storage",
              "!url": "http://www.wix.com/reference/wix-storage.html#session"
            }
          }
        },
      });
    });

    it('mixed services', function() {
      let tern = ternService(child, urlGenerator, () => {}, findMixin);

      expect(tern).to.containSubset(
        { child:
          { '!doc': 'parent',
            '!url': 'http://www.wix.com/reference/$w.child.html',
            prototype:
              { childProp:
                { '!type': 'bool',
                  '!doc': 'prop',
                  '!url': 'http://www.wix.com/reference/$w.child.html#childProp' },
                childOp:
                  { '!type': 'fn() -> string',
                    '!doc': 'op',
                    '!url': 'http://www.wix.com/reference/$w.child.html#childOp' },
                prop:
                  { '!type': 'bool',
                    '!doc': 'prop',
                    '!url': 'http://www.wix.com/reference/$w.child.html#prop' },
                op:
                  { '!type': 'fn() -> string',
                    '!doc': 'op',
                    '!url': 'http://www.wix.com/reference/$w.child.html#op' } },
            childCallback:
              { '!type': 'fn() -> string',
                '!doc': 'op',
                '!url': 'http://www.wix.com/reference/$w.child.html#childCallback' },
            childMessage:
              { '!doc': 'op',
                '!url': 'http://www.wix.com/reference/$w.child.html#childMessage',
                value:
                  { '!type': 'string',
                    '!doc': '...',
                    '!url': 'http://www.wix.com/reference/$w.child.html#childMessage' } } } });

      expect(tern).to.not.containSubset(
        { child:
          { '!doc': 'parent',
            '!url': 'http://www.wix.com/reference/$w.child.html',
            callback:
              { '!type': 'fn() -> string',
                '!doc': 'op',
                '!url': 'http://www.wix.com/reference/$w.child.html#callback' },
            message:
              { '!doc': 'op',
                '!url': 'http://www.wix.com/reference/$w.child.html#message',
                value:
                  { '!type': 'string',
                    '!doc': '...',
                    '!url': 'http://www.wix.com/reference/$w.child.html#message' } } }
        })
    })
  });
});
