/* eslint-disable no-unused-vars */
import fs from "fs";

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
  async doSomething() {
    let file = await new Promise(function (fulfill, reject) {
      fs.readFile("name", {}, (e: any) => (e ? reject(e) : fulfill()));
    });
    return file;
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
