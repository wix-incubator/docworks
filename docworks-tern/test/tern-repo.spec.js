import chai from 'chai';
import chaiSubset from 'chai-subset';
import tern from '../lib/tern-repo';
import {readFromDir} from 'docworks-repo';

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

  it('for repo', async function() {
    let repo = await readFromDir('./test/services');

    let ternModel = tern(repo.services, 'Wix APIs', urlGenerator);

    expect(ternModel).to.containSubset({
      "!define": {
        "$w": {
          "HiddenCollapsedMixin": {
            '!doc': 'Provides functionality for all elements that can be hidden or collapsed.',
            '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html',
            prototype:
              { hidden:
                { '!type': 'bool',
                  '!doc': 'Indicates if the element is visible or hidden.',
                  '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#hidden' },
                isVisible:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is actually visible.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#isVisible' },
                hide:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Hides the element and sets its `hidden` property\n to `true`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#hide' },
                show:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Shows the element and sets its `hidden` property\n to `false`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#show' },
                collapsed:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is collapsed or expanded.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#collapsed' },
                collapse:
                  { '!type': 'fn() -> +Promise[value=+void]',
                    '!doc': 'Collapses the element and sets its `collapsed` property to `true`.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#collapse' },
                expand:
                  { '!type': 'fn() -> +Promise[value=+void]',
                    '!doc': 'Expands the element and sets its `collapsed` property to `false`.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenCollapsedMixin.html#expand' } } },
          "HiddenMixin": {
            '!doc': 'Provides functionality for elements that can be hidden.\n\n To learn about the behavior of a hidden element,\n see the [`hidden`](#hidden) property.',
            '!url': 'http://www.wix.com/reference/$w.HiddenMixin.html',
            prototype:
              { hidden:
                { '!type': 'bool',
                  '!doc': 'Indicates if the element is visible or hidden.',
                  '!url': 'http://www.wix.com/reference/$w.HiddenMixin.html#hidden' },
                isVisible:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is actually visible.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenMixin.html#isVisible' },
                hide:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Hides the element and sets its `hidden` property\n to `true`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenMixin.html#hide' },
                show:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Shows the element and sets its `hidden` property\n to `false`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.HiddenMixin.html#show' } } },
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
          "Dropdown": {
            '!doc': 'Dropdowns are used for selecting one of a number of options.\n They are especially useful when there are too many options to display using\n [radio buttons]($w.RadioButtonGroup.html). Dropdowns consist of a list\n of [options](#Option). Each [option](#Option) contains a label, which is\n what the user sees, and a value, which is what is used in code and stored in\n you collections.',
            '!url': 'http://www.wix.com/reference/$w.Dropdown.html',
            prototype:
              { hidden:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is visible or hidden.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#hidden' },
                isVisible:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is actually visible.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#isVisible' },
                hide:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Hides the element and sets its `hidden` property\n to `true`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#hide' },
                show:
                  { '!type': 'fn(animationName: string) -> +Promise[value=+void]',
                    '!doc': 'Shows the element and sets its `hidden` property\n to `false`, using an animation if specified.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#show' },
                collapsed:
                  { '!type': 'bool',
                    '!doc': 'Indicates if the element is collapsed or expanded.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#collapsed' },
                collapse:
                  { '!type': 'fn() -> +Promise[value=+void]',
                    '!doc': 'Collapses the element and sets its `collapsed` property to `true`.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#collapse' },
                expand:
                  { '!type': 'fn() -> +Promise[value=+void]',
                    '!doc': 'Expands the element and sets its `collapsed` property to `false`.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#expand' } },
            Option:
              { '!doc': 'An object used by the `options` property that contains the attributes of a dropdown list item.',
                '!url': 'http://www.wix.com/reference/$w.Dropdown.html#Option',
                value:
                  { '!type': 'string',
                    '!doc': 'The value of the dropdown option. This is what you use in code and is what is stored in your collections.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#Option' },
                label:
                  { '!type': 'string',
                    '!doc': 'The label of the dropdown option. This is what a user sees.',
                    '!url': 'http://www.wix.com/reference/$w.Dropdown.html#Option' } }
          }
        },
        "callbacks": {
          '!doc': '',
          '!url': 'http://www.wix.com/reference/callbacks.html',
          prototype:
            { onViewportEnter:
              { '!type': 'fn(handler: callbacks.EventHandler) -> +$w.Element',
                '!doc': 'Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.',
                '!url': 'http://www.wix.com/reference/callbacks.html#onViewportEnter' },
              onViewportEnter2:
                { '!type': 'fn(handler: callbacks.EventHandler2) -> +$w.Element',
                  '!doc': 'Adds an event handler that runs when an element is scrolled\n into the viewable part of the current window.',
                  '!url': 'http://www.wix.com/reference/callbacks.html#onViewportEnter2' } },
          EventHandler: {
            '!type': 'fn()',
            '!doc': '',
            '!url': 'http://www.wix.com/reference/callbacks.html#EventHandler'
          },
          EventHandler2: {
            '!type': 'fn(event: +Event, $w: +$w.$w) -> number',
            '!doc': '',
            '!url': 'http://www.wix.com/reference/callbacks.html#EventHandler2'
          } },
        "functions": {
          '!doc': '',
          '!url': 'http://www.wix.com/reference/functions.html',
          prototype:
            { resetValidityIndication:
              { '!type': 'fn()',
                '!doc': 'Resets the element\'s visual validity indication.',
                '!url': 'http://www.wix.com/reference/functions.html#resetValidityIndication' },
              to:
                { '!type': 'fn(url: string)',
                  '!doc': 'Directs the browser to navigate to the specified URL.',
                  '!url': 'http://www.wix.com/reference/functions.html#to' },
              openLightbox:
                { '!type': 'fn(name: string, data: obj) -> +Promise[value=obj]',
                  '!doc': 'Opens a lightbox and optionally passes it the given data.',
                  '!url': 'http://www.wix.com/reference/functions.html#openLightbox' },
              scrollBy:
                { '!type': 'fn(x: number, y: number) -> +Promise[value=+void]',
                  '!doc': 'Scrolls the page by a given number of pixels.',
                  '!url': 'http://www.wix.com/reference/functions.html#scrollBy' } } },
        "properties": {
          '!doc': '',
          '!url': 'http://www.wix.com/reference/properties.html',
          prototype:
            { prop1:
              { '!type': 'string',
                '!doc': 'Summary of prop 1',
                '!url': 'http://www.wix.com/reference/properties.html#prop1' },
              prop2:
                { '!type': 'string',
                  '!doc': 'Summary of prop 2',
                  '!url': 'http://www.wix.com/reference/properties.html#prop2' },
              arrayProp:
                { '!type': '[string]',
                  '!doc': 'Summary of arrayProp',
                  '!url': 'http://www.wix.com/reference/properties.html#arrayProp' } } }
      },
      "!name": "Wix APIs"
    });
  });
});
