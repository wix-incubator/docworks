/* eslint-disable */

'use strict'
const someJSdocInternalModule = require.resolve('jsdoc/lib/jsdoc/app.js', './')
const runtimePath = require.resolve('jsdoc/lib/jsdoc/util/runtime', './')

const jsdocRoot = someJSdocInternalModule.replace('lib/jsdoc/app.js', '')
const jsdocLib = [jsdocRoot, 'lib'].join('')
const internalJsdoc = [jsdocLib, 'jsdoc'].join('')

const extraPaths = [internalJsdoc, jsdocLib, jsdocRoot]

var ogRequire = require;
const requizzle = require('requizzle')
require = requizzle({
  requirePaths: extraPaths,
  infect: true
})

const jsdocPath = jsdocRoot
// const pwd = __dirname
const pwd = process.cwd()

require(runtimePath).initialize([jsdocPath, pwd])

const env = require('jsdoc/lib/jsdoc/env')
const cli = require('jsdoc/cli')

require = ogRequire

module.exports = {
    env,
    cli
}

/* eslint-enable */
