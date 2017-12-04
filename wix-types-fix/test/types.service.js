/**
 * @class Service
 * @summary A service
 */
class Service {

  /**
   * @typedef {external:Object} Service~aType
   * @property {external:Boolean} boolProp -
   * @property {external:String} stringProp -
   */

  /**
   * @member label
   * @type {external:String}
   * @memberof Service
   */
  get label() {}

  /**
   * @member valid
   * @type {external:Boolean}
   * @memberof Service
   */
  get valid() {}

  /**
   * @callback Service.Event
   * @param {external:String|external:Boolean} value
   * @param {external:Function} reject
   */

  /**
   * @function onEvent
   * @param {Service.Event} event function
   * @memberof Service
   */
  onEvent(event) { }


  /**
   * @function aFunction
   * @memberof Service
   * @param {external:String} param
   * @returns {external:Number}
   */
  aFunction(param) { }
}
