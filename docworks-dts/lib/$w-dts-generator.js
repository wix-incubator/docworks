const {
  convertTreeToString,
  dtsNamespace,
  dtsFunction
} = require('./dts-generator')


function createDollarWDTSNamespace(dollarWService) {
  const namespace = dtsNamespace('$w', dollarWService.docs.summary)
  const funcsToExclude = ['$w']
  dollarWService.operations.forEach(operation => {
    if (funcsToExclude.includes(operation.name)) return
    const jsDocComment = operation.docs.summary
    const functionDeclaration = dtsFunction(operation.name, operation.params, operation.ret.type, {jsDocComment})
    namespace.members.push(functionDeclaration)
  })
  return namespace
}

function includeDollarWHardcodedSelectors() {
  return `
    type IntersectionArrayAndBase<T> = {
      [P in keyof T]: P extends "Document" ? T[P] : T[P] & [T[P]];
    }
    
    type ComponentSelectorByType = IntersectionArrayAndBase<TypeNameToSdkType>
    
    declare function $w<T extends keyof PageElementsMap>(selector: T): PageElementsMap[T]
    declare function $w<T extends keyof ComponentSelectorByType>(selector: T): ComponentSelectorByType[T]  
  `
}

function createTypeNameToSdkType() {
  // TODO 09/09/2019 NMO - AMIT CODE COMES HERE...
  return 'type TypeNameToSdkType = {"amit": "string"}'
}

function createDollarWDTS(services) {
  const servicesCollection = ([].concat(services))
  const [dollarWService] = servicesCollection.filter(service => service.name === '$w')
  if (!dollarWService) {
    return ''
  }

  const typeNameToSdkTypeMap = createTypeNameToSdkType()

  const $wNS = createDollarWDTSNamespace(dollarWService)
  const $wNSAsString = convertTreeToString({'$w': $wNS})

  return `
    ${typeNameToSdkTypeMap}
    
    ${$wNSAsString}
    
    ${includeDollarWHardcodedSelectors()}
  `
}


module.exports = {
  createDollarWDTS
}
