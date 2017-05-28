

/**
 * @class ServiceUnknownTypes
 * @summary A test service
 * @memberof aNamespace
 */
class ServiceUnknownTypes {

    /**
     * @function unknownType
     * @memberof aNamespace.ServiceUnknownTypes
     * @param {Unknown1} unknown a non existent parameter type
     * @returns {Unknown2}
     */
    unknownType() {
    }


    /**
     * @typedef Type1
     * @memberof aNamespace.ServiceUnknownTypes
     * @property {Unknown1} unknown
     */

    /**
     * @typedef Type2
     * @memberof aNamespace.ServiceUnknownTypes
     * @property {string} known
     */

    /**
     * @function typedefFullPath
     * @memberof aNamespace.ServiceUnknownTypes
     * @param {aNamespace.ServiceUnknownTypes.Type2} type2 a full path parameter
     */
    typedefFullPath() {
    }

    /**
     * @function typedefRelativePath
     * @memberof aNamespace.ServiceUnknownTypes
     * @param {Type2} type2 a relative path parameter
     */
    typedefRelativePath() {
    }

    /**
     * @member unknownProperty
     * @memberof aNamespace.ServiceUnknownTypes
     * @type {Unknown1}
     */
    get aString() {
    }

}


export default ServiceUnknownTypes;
