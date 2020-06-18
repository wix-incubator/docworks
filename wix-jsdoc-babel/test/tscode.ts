
/**
 * @class TSCode
 * @summary A test class for TS code
 * @memberof aNamespace
 */
class TSCode {
  /**
   * @function doSomething
   * @memberof aNamespace.TSCode
   * @summary an operation
   * @returns {Promise<string>}
   */
  async doSomething(param: boolean) {
    return await new Promise(function (resolve, reject) {
      if (param) {
        resolve()
      } else {
        reject()
      }
    });
  }

  /**
   * @function concatArrays
   * @memberof aNamespace.TSCode
   * @summary an operation
   * @param {Array} arr input the input
   * @param {Array} arr2 the input
   * @returns {Array}
   */
  concatArrays(arr: any, arr2: any) {
    return new Array(...arr, ...arr2);
  }
}
