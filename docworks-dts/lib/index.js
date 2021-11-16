'use strict'

const dts = require('./dts-repo')
const dts2 = require('./new/dts-repo')
const docworksToDtsConverters = require('./dts-converters')
const dtsGenerator = require('./dts-generator')

module.exports = dts
module.exports.docworksToDtsConverters = docworksToDtsConverters
module.exports.dtsGenerator = dtsGenerator
module.exports.dts2 = dts2
