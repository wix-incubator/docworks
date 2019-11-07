const {
  dtsAlias
} = require('./dts-generator')

const $W = '$w'

function remove$wModule(modules) {
  delete modules[$W]
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

function $wFixer(modules, namespaces) {
  remove$wModule(modules)
  addDatasetAliasesTo$wNamespace(namespaces)
}

module.exports = $wFixer
