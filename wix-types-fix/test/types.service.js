/* eslint-disable no-unused-vars,getter-return */
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
   * @member date
   * @type {external:Date}
   * @memberof Service
   */
  get date() {}

  /**
   * @member union
   * @type {external:Number|Service.aType}
   * @memberof Service
   */
  get union() {}

  /**
   * @member array
   * @type {external:String[]}
   * @memberof Service
   */
  get array() {}


  /**
   * @member readWrite
   * @type {external:String}
   * @memberof Service
   */
  get readWrite() {}

  /**
   * @member readWrite
   * @param {external:String} param
   * @memberof Service
   */
  set readWrite(param) {}

  /**
   * @callback Service.Event
   * @param {external:String|external:Boolean} value
   * @param {external:Function} reject
   */

  /**
   * @function anAsyncFunction
   * @returns {external:Promise} abcd
   * @fulfill {external:String} fulfill docs
   * @reject {external:String} error docs
   * @memberof Service
   */
  anAsyncFunction() {}

  /**
   * @function anAsyncFunctionNoReturnDoc
   * @returns {external:Promise}
   * @fulfill {external:String} fulfill docs
   * @reject {external:String} error docs
   * @memberof Service
   */
  anAsyncFunctionNoReturnDoc() {}

  /**
   * @callback anAsyncCallback
   * @returns {external:Promise} abcd
   * @fulfill {external:String} fulfill docs
   * @reject {external:String} error docs
   * @memberof Service
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
