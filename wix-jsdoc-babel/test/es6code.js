import fs from 'fs';

/**
 * @class ES6Code
 * @summary A test class for ES6 code
 * @memberof aNamespace
 */
class ES6Code {

  /**
   * @function doSomething
   * @memberof aNamespace.ES6Code
   * @summary an operation
   * @returns {Promise<string>}
   */
  async doSomething() {
    let file = await new Promise(function(fulfill, reject) {fs.readFile('name', {}, (e) => e?reject(e):fulfill())});
    return file;
  }

  /**
   * @function concatArrays
   * @memberof aNamespace.ES6Code
   * @summary an operation
   * @param {Array} arr input the input
   * @param {Array} arr2 the input
   * @returns {Array}
   */
  concatArrays(arr, arr2) {
    return new Array(...arr, ...arr2);
  }
}