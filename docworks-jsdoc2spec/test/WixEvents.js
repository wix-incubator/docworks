import get from 'lodash/get';

/**
 * @callback $w.EventHandler
 * @description Handles events.
 * @param {$w.Event} event The event that occurred.
 * @param {$w.$w} $w A selector function. The $w function enables event handlers
 *  to work with elements in [repeaters]($w.Repeater.html#repeating-callback-selector)
 *  and in the [global scope]($w.Repeater.html#regular-callback-selector).
 */

/**
 * @class Event
 * @summary Events are fired when certain actions occur to elements.
 * @description
 *  Events can be caused by user interactions, such as clicking the mouse or
 *  pressing a key, or generated programmatically, such as hiding or showing an
 *  element using the [hide()]($w.HiddenMixin.html#hide) and
 *  [show()]($w.HiddenMixin.html#hide) functions.
 * @memberof $w
 */
class WixEvent {
  constructor(target, event) {
    this.target = target;
    this.type = get(event, 'action') || get(event, 'type');
    this.syntheticEvent = event;

    const context = get(event, 'context');
    if (context) {
      this.context = context;
    }
  }

  /**
   * @member {$w.Element} target
   * @label property
   * @syntax
   * get target(): string
   * @summary Gets the element that the event was fired on.
   * @note
   *  When using the target to get the `value` of a text input or text box in an [`onKeyPress`]($w.TextInputMixin.html#onKeyPress)
   *  event handler, you may receive the value of the element before the key
   *  was pressed. To get the text input or text box's updated value, use the [`updatedTargetValue`]($w.KeyboardEvent.html#updatedTargetValue)
   *  property of the event handler's `event` parameter.
   * @snippet [Event-target.es6=Get the ID of the target element]
   * @memberof $w.Event
   * @readonly
   */

  /**
   * @member {external:String} type
   * @label property
   * @syntax
   * get type(): string
   * @summary Gets the type of event that was fired.
   * @snippet [Event-type.es6=Get the type of the event]
   * @memberof $w.Event
   * @readonly
   */

  /**
   * @member {external:Object} context
   * @label property
   * @syntax
   * get context(): Object
   * @summary Gets the context of the event on a repeated element.
   * @description
   *  The context property only appears in events on repeated elements.
   *
   *  It contains an object with one key:value pair. The key is "itemId" and
   *  the value is the ID of the repeated item on which the event occurred.
   * @snippet [Event-context.es6=Get the context of the event]
   * @memberof $w.Event
   * @readonly
   */

}

export default WixEvent;