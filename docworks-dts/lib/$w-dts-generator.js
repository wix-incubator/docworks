const {
  convertTreeToString,
  dtsNamespace,
  dtsFunction,
  dtsConst
} = require('./dts-generator')

const wixElementSelectorPlaceHolder = {
  placeHolder: 'wixElementSelectorPlaceHolder',
  value: 'type $w =  <T extends keyof WixElementSelector>(selector: T) => WixElementSelector[T]'
}

function createDollarWDTSNamespace(dollarWService) {
  const namespace = dtsNamespace('$w', dollarWService.docs.summary)
  const funcsToExclude = ['$w']
  dollarWService.operations.forEach(operation => {
    if (funcsToExclude.includes(operation.name)) return
    const jsDocComment = operation.docs.summary
    const functionDeclaration = dtsFunction(operation.name, operation.params, operation.ret.type, {jsDocComment})
    namespace.members.push(functionDeclaration)
  })

  const docs = {
    summary: 'Selects and returns elements from a page.'
  }
  namespace.members.push(dtsConst({name: wixElementSelectorPlaceHolder.placeHolder, type: 'string', docs}))

  return namespace
}

function getDollarWSelectorsHardcodedDTS() {
  return `    
    type IntersectionArrayAndBase<T> = {
      [P in keyof T]: P extends "Document" ? T[P] : T[P] & [T[P]];
    }

    type WixElementSelector = PageElementsMap & IntersectionArrayAndBase<TypeNameToSdkType>

    declare function $w<T extends keyof WixElementSelector>(selector: T): WixElementSelector[T]
  `
}

function createTypeNameToSdkType() {
  // TODO 09/09/2019 NMO - AMIT CODE COMES HERE...
  return `type TypeNameToSdkType = {
    "Amit_Types": string,
    "type2": string
    }`
}

function replacePlaceHolders(str) {
  return str.replace(`const ${wixElementSelectorPlaceHolder.placeHolder}: string;`, wixElementSelectorPlaceHolder.value)
}

function createDollarWDTS(services) {
  const servicesCollection = ([].concat(services))
  const [dollarWService] = servicesCollection.filter(service => service.name === '$w')
  if (!dollarWService) {
    return ''
  }

  const typeNameToSdkTypeMap = createTypeNameToSdkType()
  const $wNS = createDollarWDTSNamespace(dollarWService)
  const $wNSAsString = replacePlaceHolders(convertTreeToString({'$w': $wNS}))

  return `
    ${typeNameToSdkTypeMap}
    
    ${getDollarWSelectorsHardcodedDTS()}
    
    ${$wNSAsString}
  `
}


module.exports = {
  createDollarWDTS
}
