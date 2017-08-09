

/**
 * @class ServiceDocs
 * @summary this is a docs test service
 * @description
 * this class is used to test how service docs work
 * @see {@link http://somedomain2.com} a related site
 * @memberof aNamespace
 */
class ServiceDocs {

    /**
     * @typedef MessageWithDocs
     * @memberof aNamespace.ServiceDocs
     * @summary a Message with docs
     * @description
     * the description of the message
     * @property {string} name
     * @property {string|number} age
     */

    /**
     * @member propertyWithDocs
     * @memberof aNamespace.ServiceDocs
     * @summary the summary for propertyWithDocs
     * @description
     * the description for propertyWithDocs
     * another line of description
     * @see aNamespace.ServiceProperties a related service
     * @see {@link aNamespace.ServiceOperations) another related service
     * @see {@link http://somedomain.com} a related site
     * @type {string}
     * @example
     * // returns 2
     * let z = x.propertyWithDocs;
     * @example  <caption>the example caption</caption>
     * // returns 3
     * let z = y.propertyWithDocs;
     */
    get propertyWithDocs() {
    }

    /**
     * @summary summary from the setter
     * @description
     * desc from the setter
     * @member label
     * @memberof aNamespace.ServiceDocs
     * @param {string} value The new label to display.
     */
    set label(value) {
    }

    /**
     * @summary summary from the getter
     * @description
     * desc from the getter
     * @member label
     * @memberof aNamespace.ServiceDocs
     * @type {string}
     */
    get label() {
    }

    /**
     * @function operationWithDocs
     * @memberof aNamespace.ServiceDocs
     * @summary an operation
     * @description
     * the description of the operation
     * @param {string} input the input
     */
    operationWithDocs(input) {

    }




}


export default ServiceDocs;
