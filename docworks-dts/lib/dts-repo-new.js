const template_ = require('lodash/template')
const $wFixer = require('./$w-fixer')
const { convertTreeToString, dtsNamespace } = require('./dts-generator')
const {
  convertServiceToModule
} = require('./dts-converters-new')
const get_ = require("lodash/get")
const has_ = require("lodash/has")


function createModule(rootModule, { documentationGenerator }) {
  // todo:: if $w need to do somthing else (aka skip the operations and declare namespace insted of module)
  const service = rootModule
  const sub = rootModule.sub
  const module = convertServiceToModule(service, sub, { documentationGenerator })
  return { name: service.name, content: convertTreeToString({ module }) }
}

function dts(
  services,
  { run$wFixer = false, summaryTemplate, ignoredModules = [], ignoredNamespaces = [] } = {}
) {
  const namespaces = {}
  const modules = {}
  let documentationGenerator = ({summary}) => summary

  if (summaryTemplate) {
    documentationGenerator = values => {
      return template_(summaryTemplate)({model: values})
    }
  }

  const rootServices = {}
  const subServices = []

  services.forEach(service => {
    service.wasHere = 0
    if (!service.memberOf) {
      rootServices[service.name] = {...service, sub: {}} 
    } else {
      subServices.push(service)
    }
  })

  while (subServices.length > 0) {
    const service = subServices.shift()
    if (!service.memberOf.includes (".")) {
      if (has_(rootServices, service.memberOf)) {
        // console.log("SUB >> ", service.name, " memberOf>> ", service.memberOf)
        Object.assign(rootServices[service.memberOf].sub, { [service.name] : {...service, sub: {}} })
      } 
      else {
        // console.log("SHOULD NOT BE HERE ", service.name, " >> ", service.memberOf)
        subServices.push(service)
      }
    }
    else if (service.wasHere < 3) {
      const parentTypeParts = service.memberOf.split(".").join('.sub.')
      if (has_(rootServices, parentTypeParts)) {
        // console.log("SETTING INNER >> ", service.name, " memberOf>> ", service.memberOf)
        const directParent = get_(rootServices, parentTypeParts)
        const targetSub = Object.assign({}, directParent.sub, { [service.name] : {...service, sub: {}}})
        directParent.sub = targetSub
      }
      else {
        // console.log(" PATH DOES NOT EXSISTS FIRST TIME >> ", parentTypeParts, " >> ", service.name)
        service.wasHere++
        subServices.push(service)
      }
    }
    else {
      throw Error("UNKNOW MODULE " + service.name)
    }
  }

  const generatedModules = []
  Object.keys(rootServices).forEach(root => {
    generatedModules.push(createModule(rootServices[root], { documentationGenerator }))
  })

  debugger
  // remove ignored modules and namespaces from output
  ignoredNamespaces.forEach(namespace => delete namespaces[namespace])
  ignoredModules.forEach(module => delete modules[module])
  ignoredModules.forEach(module => delete generatedModules[module])

  if (run$wFixer) {
    $wFixer(modules, namespaces)
  }

  return generatedModules
}

module.exports = dts
