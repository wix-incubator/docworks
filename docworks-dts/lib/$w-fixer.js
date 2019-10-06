const {
  dtsAlias,
  dtsFunction,
  dtsFunctionTypeAlias,
  dtsIntersection,
  dtsNamespace,
  dtsNamedTypeReference,
  dtsProperty,
  dtsObjectTypeAlias,
  dtsTypeParameter
} = require('./dts-generator')
const {
  convertOperationParamToParameters,
  convertOperationToFunction
} = require('./dts-converters')

const WIX_SELECTOR_TYPE = 'WixElementSelector'
const WIX_SELECTOR_TYPE_VARIABLE = 'T'
const QUERYABLE_TYPE = 'TypeNameToSdkType'
const PAGE_ELEMENTS_MAP_TYPE = 'PageElementsMap'
const INTERSECTION_ARRAY_AND_BASE_TYPE = 'IntersectionArrayAndBase'
const $W = '$w'

function remove$wModule(modules) {
  delete modules[$W]
}

function get$wFunctionMembers(operation) {
  const name = operation.name
  const params = operation.params.map(param => {
    if (param.name === 'selector') {
      const selectorParam = Object.assign({}, param)
      selectorParam.type = `${WIX_SELECTOR_TYPE_VARIABLE}`
      return selectorParam
    }
    return param
  })
  const returnType = `${WIX_SELECTOR_TYPE}[${WIX_SELECTOR_TYPE_VARIABLE}]`
  const typeParameters = [dtsTypeParameter(`${WIX_SELECTOR_TYPE_VARIABLE}`, `keyof ${WIX_SELECTOR_TYPE}`)]
  const jsDocComment = operation.docs.summary

  return {name, params, returnType, typeParameters, jsDocComment}
}

function convent$wOperationToFunctionType(operation) {
  const {name, params, returnType, typeParameters, jsDocComment} = get$wFunctionMembers(operation)
  const parameters = params.map(convertOperationParamToParameters)

  return dtsFunctionTypeAlias(name, parameters, returnType, {jsDocComment, funcTypeParameters: typeParameters})
}

function convert$wOperationToFunction(operation) {
  const {name, params, returnType, typeParameters, jsDocComment} = get$wFunctionMembers(operation)
  const parameters = params.map(convertOperationParamToParameters)

  return dtsFunction(name, parameters, returnType, {jsDocComment, typeParameters})
}

function is$wOperation(operation) {
  return operation.name === $W
}

function convert$wServiceToNamespace(service) {
  const $wOperation = service.operations.find(is$wOperation)
  const $wFuncType = convent$wOperationToFunctionType($wOperation)
  const operations = service.operations.filter(o => !is$wOperation(o)).map(convertOperationToFunction)

  operations.push($wFuncType)

  const namespace = dtsNamespace(service.name, {jsDocComment: service.docs.summary})
  namespace.members = operations

  return namespace
}

function getUtilityTypes() {
  const name = `${INTERSECTION_ARRAY_AND_BASE_TYPE}<T, P>`
  const type = '{[K in keyof T]: K extends P ? T[K] : T[K] & T[K][];}'
  return dtsAlias(name, type)
}

function getQueryableObjectType(services) {
  const isQueryableService = service => service.memberOf === $W && service.extra.queryable
  const queryableServices = services.filter(isQueryableService)
  const properties = queryableServices.map(service => dtsProperty(service.name, `${$W}.${service.name}`))

  return dtsObjectTypeAlias(QUERYABLE_TYPE, properties)
}

function getWixElementSelectorType() {
  const pageElementType = dtsNamedTypeReference(PAGE_ELEMENTS_MAP_TYPE)
  const intersectionArrayAndBaseType = dtsNamedTypeReference(`${INTERSECTION_ARRAY_AND_BASE_TYPE}<${QUERYABLE_TYPE}, 'Document'>`)
  const type = dtsIntersection([pageElementType, intersectionArrayAndBaseType])

  return dtsAlias(WIX_SELECTOR_TYPE, type)
}

// CRVD-902 - this is a very ugly hack to fix the model. dataset is part of the $w and the fix should be in docs
function addDatasetAliasesTo$wNamespace(namespaces) {
  const $wNamespace = namespaces[$W]
  if (!$wNamespace) {
    return
  }

  const datasetType = dtsAlias('dataset', 'wix_dataset.Dataset')
  const routerDatasetType = dtsAlias('router_dataset', 'wix_dataset.DynamicDataset')

  $wNamespace.members.push(datasetType)
  $wNamespace.members.push(routerDatasetType)
}

function $wFixer(services, modules, namespaces) {

  remove$wModule(modules)
  addDatasetAliasesTo$wNamespace(namespaces)

  const $wService = services.find(service => service.name === $W && !Object.prototype.hasOwnProperty.call(service, 'memberOf'))
  const $wOperation = $wService.operations.find(is$wOperation)

  const $wNamespace = convert$wServiceToNamespace($wService)
  const $wFunc = convert$wOperationToFunction($wOperation)
  const queryableType = getQueryableObjectType(services)
  const wixElementSelectorType = getWixElementSelectorType()
  const utilityTypes = getUtilityTypes()

  return {declaration: {queryableType, utilityTypes, wixElementSelectorType, $wFunc, $wNamespace}}
}

module.exports = $wFixer
