const {
  convertTreeToString,
  dtsNamespace,
  dtsFunction
} = require('./dts-generator')


function createDollarWDTSNamespace(dollarWService) {
  const namespace = dtsNamespace('$w', dollarWService.docs.summary)
  const funcsToDeclare = ['at', 'onReady']
  funcsToDeclare.forEach(funcName => {
    const funcServiceModel = dollarWService.operations.find(operation => operation.name === funcName)
    const jsDocComment = funcServiceModel.docs.summary
    const functionDeclaration = dtsFunction(funcName, funcServiceModel.params, funcServiceModel.ret.type, {jsDocComment})
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
    throw new Error('$w service must be provided')
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

function createHardCodedDollarWDTS() {
  return `
    /**
     * The \`$w\` namespace contains everything you need in order to work
     *  with your site's components. It contains all of the UI elements, nodes, and
     *  events that make up your site. It also includes the [\`$w()\`]($w.html#w),
     *  [\`onReady()\`]($w.html#onReady), and [\`at()\`]($w.html#at) functions.
     *
     *  The APIs in \`$w\` can only be used in front-end code.
     *
     *  You do not need to import \`$w\`.
     */
    declare namespace $w {
      /**
       * Gets a selector function for a specific context.
       */
      export function at(context: $w.Event.EventContext): $w.$w;
    
      /**
       * Sets the function that runs when all the page elements have finished loading.
       */
      export function onReady(initFunction: $w.ReadyHandler): void;
    
      /**
       * Selects and returns elements from a page.
       */
      type $w =  <T extends keyof WixElementSelector>(selector: T) => WixElementSelector[T]
    }  
  `
}


module.exports = {
  createDollarWDTS,
  createHardCodedDollarWDTS
}
