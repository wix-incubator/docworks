const resolve = require('resolve')
const logger = require('./logger')

function resolveAndInitPlugins(plugins) {
  return (plugins ? (Array.isArray(plugins) ? plugins : [plugins]) : [])
    .map(pluginCmd => {
        let [plugin, param] = pluginCmd.split(/:(.+)/)
        plugin = resolve.sync(plugin, {basedir: '.'})
        try {
          const pluginModule = require(plugin)
          if (param && pluginModule.init) {
            pluginModule.init(param)
          }
        }
        catch (err) {
            logger.error(`could not require plugin ${plugin}`)
        }
        return plugin
      }
    )
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
