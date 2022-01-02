'use strict'

const dts = require('./dts-repo')
const dtsMultipleFiles = require('./multiple-files')
const docworksToDtsConverters = require('./dts-converters')
const dtsGenerator = require('./dts-generator')

module.exports = dts
module.exports.docworksToDtsConverters = docworksToDtsConverters
module.exports.dtsGenerator = dtsGenerator
module.exports.dtsMultipleFiles = dtsMultipleFiles
