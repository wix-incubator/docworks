

/**
 * @class ServiceTypes
 * @summary A test service
 * @memberof aNamespace
 */
class ServiceTypes {
    /**
     * @member aString
     * @memberof aNamespace.ServiceTypes
     * @type {string}
     */
    get aString() {
    }

    /**
     * @member aNumber
     * @memberof aNamespace.ServiceTypes
     * @type {number}
     */
    get aNumber() {
    }

    /**
     * @member aBoolean
     * @memberof aNamespace.ServiceTypes
     * @type {boolean}
     */
    get aBoolean() {
    }

    /**
     * @member aDate
     * @memberof aNamespace.ServiceTypes
     * @type {Date}
     */
    get aDate() {
    }

    /**
     * @member union
     * @memberof aNamespace.ServiceTypes
     * @type {string | number}
     */
    get union() {
    }

    /**
     * @member anArray
     * @memberof aNamespace.ServiceTypes
     * @type {string[]}
     */
    get anArray() {
    }

    /**
     * @member anArray2
     * @memberof aNamespace.ServiceTypes
     * @type {Array.<string>}
     */
    get anArray2() {
    }

    /**
     * @function multiDimArray
     * @memberof aNamespace.ServiceTypes
     * @returns {string[][]}
     */
    multiDimArray() {
    }

    /**
     * @function promiseArray
     * @memberof aNamespace.ServiceTypes
     * @returns {Promise<string[]>}
     */
    promiseArray() {
    }

    /**
     * @function unknownType
     * @memberof aNamespace.ServiceTypes
     * @param {Unknown1} unknown a non existent parameter type
     * @returns {Unknown2}
     */
    unknownType() {
    }
}


export default ServiceTypes;
