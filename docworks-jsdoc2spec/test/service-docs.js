

/**
 * @class ServiceDocs
 * @summary A test service
 * @memberof aNamespace
 */
class ServiceDocs {

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

}


export default ServiceDocs;
