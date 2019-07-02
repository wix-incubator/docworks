import chai from 'chai'

let registered = false

if (!registered) {
  registered = true
  chai.Assertion.addMethod('containError', function (error) {
    let obj = this._obj

    let foundError = obj.find(_ => _.message && _.message.includes(error))
    // second, our type check
    this.assert(
      !!foundError
      , `expected errors to contain error with ${error}`
      , `expected errors to not contain error with ${error}, but found the error ${foundError?foundError.message:''}`
      , error        // expected
      , obj   // actual
    )
  })
}
