'use strict'

const dts = require('./dts-repo')
const dtsNew = require('./dts-repo-new')
const docworksToDtsConverters = require('./dts-converters')
const dtsGenerator = require('./dts-generator')

module.exports = dts
module.exports.dtsNew = dtsNew
module.exports.docworksToDtsConverters = docworksToDtsConverters
module.exports.dtsGenerator = dtsGenerator
