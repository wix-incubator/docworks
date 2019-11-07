const resolve = require('resolve')
const logger = require('./logger')

function resolveAndInitPlugins(plugins) {
  return (plugins ? (Array.isArray(plugins) ? plugins : [plugins]) : []).map(
    pluginCmd => {
      let [pluginName, param] = pluginCmd.split(/:(.+)/)
      try {
        const pluginPath = resolvePluginPath(pluginName)
        const pluginModule = require(pluginPath)
        if (param && pluginModule.init) {
          pluginModule.init(param)
        }
        return pluginPath
      } catch (err) {
        logger.error(`could not require plugin ${pluginName}`, err)
        throw err
      }
    }
  )
}

const resolvePluginPath = pluginName => {
  try {
    // resolve from the working directory
    return resolve.sync(pluginName, { basedir: '.' })
  } catch (e) {
    // didn't find the plugin in the working directory
  }
  // resolve from the running docworks module directory
  return resolve.sync(pluginName, { basedir: __dirname })
}

async function runPlugins(plugins, pluginFunction, ...params) {
  if (plugins) {
    const pluginsToRun = plugins
      .map(require)
      .filter(plugin => !!plugin[pluginFunction])
    for (const plugin of pluginsToRun)
      await plugin[pluginFunction](...(params || []))
  }
}

module.exports = {
  resolveAndInitPlugins,
  runPlugins
}
