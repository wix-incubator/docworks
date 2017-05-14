

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
}


export default ServiceMessages;
