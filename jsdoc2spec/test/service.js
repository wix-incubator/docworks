

/**
 * @class Service
 * @summary A test service
 * @memberof aNamespace
 */
class Service {
    /**
     * @member label
     * @label property
     * @syntax
     * get label(): string
     * set label(value: string): void
     * @summary Sets or returns the label.
     * @description
     *  Setting the value of the `label` property sets the text label on a text
     *  button.
     *
     *  Getting the value of the `label` property returns the value of the
     *  button's text label.
     * @type {string}
     * @memberof aNamespace.Service
     * @instance
     */
    get label() {
    }

    /**
     * @param {string} value The new label to display.
     * @ignore
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
     */
    operation(input) {

    }
}


export default Service;
