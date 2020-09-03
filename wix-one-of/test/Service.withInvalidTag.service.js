/* eslint-disable getter-return,no-unused-vars */
/**
 * @class Service
 * @summary A test service
 * @memberof aNamespace
 */
class Service {

  /**
   * @typedef Message
   * @memberof aNamespace.Service
   * @property {string} name is mandatory
   * @property {string} [address] is optional
   * @property {number} age is oneOf group 1 prop 1
   * @property {number|string} yearOfBirth is oneOf group 1 prop 2
   * @property {number} idNumber is oneOf group 2 prop 1
   * @property {number} passportId is oneOf group 2 prop 2
   * @oneof age_group1 - age yearOfBirth
   * @oneof age_group2 - age yearOfBirth
   */

}


export default Service
