/* eslint-disable no-unused-vars,getter-return,no-dupe-class-members */

/**
 * @class ServiceMessages
 * @summary A test service
 * @memberof aNamespace
 */
class ServiceMessages {

    /**
     * @typedef InMessage
     * @memberof aNamespace.ServiceMessages
     * @property {string} name
     * @property {string|number} age
     */

    /**
     * @typedef OutMessage
     * @memberof aNamespace.ServiceMessages
     * @property {string} name
     * @property {string|number} age
     */

    /**
     * @typedef ComplexMessage
     * @memberof aNamespace.ServiceMessages
     * @property {aNamespace.ServiceMessages.InMessage} in1
     * @property {aNamespace.ServiceMessages.InMessage} in2
     */

    /**
     * @member prop
     * @memberof aNamespace.ServiceMessages
     * @type {aNamespace.ServiceMessages.OutMessage}
     */
    get prop() {
    }

    /**
     * @function operation
     * @memberof aNamespace.ServiceMessages
     *
     * @param {aNamespace.ServiceMessages.InMessage} input the input
     * @returns {aNamespace.ServiceMessages.OutMessage} output
     */
    operation(input) {

    }

    /**
     * @function operationComplex
     * @memberof aNamespace.ServiceMessages
     *
     * @param {aNamespace.ServiceMessages.ComplexMessage} input the input
     */
    operation(input) {

    }
}


export default ServiceMessages
