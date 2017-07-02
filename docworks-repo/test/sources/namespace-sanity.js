

/**
 * @namespace aNamespace
 * @summary A test service
 */
const namespace = {
    /**
     * @function operation
     * @memberof aNamespace
     * @summary an operation
     * @description
     * the description of the operation
     *
     * @param {string} input the input
     */
    operation(input) {

    },

    /**
     * @typedef aType
     * @memberof aNamespace
     * @property {string} prop
     */

    /**
     * @namespace child
     * @summary A test service
     * @memberOf aNamespace
     */
    child: {
        /**
         * @function op2
         * @memberof aNamespace.child
         */
        op2() {

        }
    }
};

export default namespace;
