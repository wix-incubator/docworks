/* eslint-disable no-unused-vars,getter-return */


/**
 * @mixin aMixin
 * @memberOf aNamespace
 * @summary A test mixin
 */
export class aMixin {

  /**
   * @typedef InMessage
   * @memberof aNamespace.aMixin
   * @property {string} name
   * @property {string|number} age
   */

  /**
   * @callback aCallback
   * @memberof aNamespace.aMixin
   * @param {number} x -
   */

  /**
   * @function operation
   * @memberof aNamespace.aMixin
   * @summary an operation
   * @description
   * the description of the operation
   *
   * @param {string} input the input
   */
  operation(input) {

  }

  /**
   * @member readOnly
   * @memberof aNamespace.aMixin
   * @type {string}
   * @summary Sets or returns the label.
   */
  get readOnly() {
  }

}

/**
 * @class aMixes
 * @memberOf aNamespace
 * @mixes aNamespace.aMixin
 */
export class aMixes {

}
