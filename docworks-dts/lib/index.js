'use strict'

const dts = require('./dts-repo')
const docworksToDtsConverters = require('./dts-converters')
const dtsGenerator = require('./dts-generator')

module.exports = dts
module.exports.docworksToDtsConverters = docworksToDtsConverters
module.exports.dtsGenerator = dtsGenerator
