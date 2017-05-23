

/**
 * @class ServiceCallbacks
 * @summary A test service
 * @memberof aNamespace
 */
class ServiceCallbacks {

    /**
     * @callback aCallback
     * @memberof aNamespace.ServiceCallbacks
     * @param {number} x -
     */

    /**
     * @function operationWithCallback
     * @memberof aNamespace.ServiceCallbacks
     * @summary an operation
     * @description
     * the description of the operation
     *
     * @param {string} input the input
     * @param {aNamespace.ServiceCallbacks.aCallback} callback the input
     */
    operationWithCallback(input, callback) {

    }

    /**
     * @callback aComplexCallbackCallback
     * @memberof aNamespace.ServiceCallbacks
     * @param {number} z -
     */

    /**
     * @callback aComplexCallback
     * @memberof aNamespace.ServiceCallbacks
     * @param {number} x -
     * @param {string} y -
     * @param {aNamespace.ServiceCallbacks.aComplexCallbackCallback} cb -
     * @returns {Promise<string>}
     */

    /**
     * @function operationWithComplexCallback
     * @memberof aNamespace.ServiceCallbacks
     * @summary an operation
     * @description
     * the description of the operation
     *
     * @param {string} input the input
     * @param {aNamespace.ServiceCallbacks.aComplexCallback} callback the input
     */
    operationWithComplexCallback(input, callback) {

    }

    /**
     * @callback AnErrorCallback
     * @memberof aNamespace.ServiceCallbacks
     * @param {Unknown} z -
     */

    /**
     * @function operationWithErrorCallback
     * @memberof aNamespace.ServiceCallbacks
     * @summary an operation
     * @description
     * the description of the operation
     *
     * @param {string} input the input
     * @param {AnErrorCallback} callback the input
     */
    operationWithErrorCallback(input, callback) {

    }
}


export default ServiceCallbacks;
