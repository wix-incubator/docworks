'use strict'

const tern = require('./tern-repo')

function makeUrlGenerator(url) {
  return function urlGenerator(service, member) {
    let serviceFullName = service.memberOf ? `${service.memberOf}.${service.name}` : service.name
    if (member)
      return `${url}/${serviceFullName}.html#${member}`
    else
      return `${url}/${serviceFullName}.html`
  }
}

function runTern(services, baseUrl, apiName, plugins) {
  let ternOutput = tern(services, apiName, makeUrlGenerator(baseUrl), plugins)
  return JSON.stringify(ternOutput, null, '\t')
}

module.exports = runTern
