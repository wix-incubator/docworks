const path = require('path')
const fs = require('fs')

function getResourcePath(dirname) {
  return ['', process.cwd(), __dirname]
    .map(basePath => path.resolve(basePath, dirname))
    .find(dirPath => fs.existsSync(dirPath))

  // ['', process.cwd()].forEach(basePath => {
  //   let dirPath = path.resolve(basePath, dirname);
  //   if (fs.existsSync(dirPath))
  //     return dirPath
  // });
  // return undefined;
}

function resolvePluginPath(plugin) {
  let basename = path.basename(plugin)
  let dirname = path.dirname(plugin)
  let pluginPath = getResourcePath(dirname)

  if (!pluginPath) {
    throw new Error(`Unable to find the plugin ${plugin}`)
  }

  return path.join(pluginPath, basename)
}

function loadPlugins(plugins) {
  return (plugins || [])
    .map(resolvePluginPath)
    .map(require)
}

function runPlugins(plugins, pluginFunction, newExtra, repoExtra, messages, sKey) {
  let extra = Object.assign({}, newExtra)
  let extraChanged = false
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        let {changed, value} = plugin[pluginFunction](newExtra[plugin.extendDocworksKey], repoExtra[plugin.extendDocworksKey])
        if (value) {
          extra[plugin.extendDocworksKey] = value
        }
        if (changed)
          messages.push(`Service ${sKey} has changed extra.${plugin.extendDocworksKey}`)
        extraChanged = extraChanged || changed
      })
  }
  return {changed: extraChanged, merged: extra}
}

module.exports = {
  loadPlugins,
  runPlugins
}
