

/**
 * @class Service
 * @summary A test service
 * @memberof aNamespace
 */
class Service {
    /**
     * @member label
     * @memberof aNamespace.Service
     * @type {string}
     *
     * @summary Sets or returns the label.
     * @description
     *  Setting the value of the `label` property sets the text label on a text
     *  button.
     *
     *  Getting the value of the `label` property returns the value of the
     *  button's text label.
     * @overrideSummary this is the new summary
     */
    get label() {
    }

    /**
     * @member label
     * @memberof aNamespace.Service
     * @param {string} value The new label to display.
     */
    set label(value) {
    }

    /**
     * @function operation
     * @memberof aNamespace.Service
     * @summary an operation
     * @description
     * the description of the operation
     *
     * @param {string} input the input
     * @overrideSummary this is another new summary
     */
    operation(input) {

    }

  /**
   * @typedef InMessage
   * @memberof aNamespace.Service
   * @property {string} name
   * @property {string|number} age
   */

}

export default Service;
