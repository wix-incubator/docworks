/**
 * @class SampleService
 * @summary A test service
 * @memberof aNamespace
 */
class SampleService {
  /**
   * @function operation
   * @memberof aNamespace.SampleService
   * @summary Test operation
   * @description Description
   * @param {string} input the input
   */
  operation(input) {
    return input
  }

  /**
   * @member property
   * @label property
   * @memberof aNamespace.SampleService
   * @type {string}
   * @summary Returns the property
   */
  get property() {
    return 'property'
  }
}

export default SampleService
