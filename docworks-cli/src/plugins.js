let resolve = require('resolve');

export function resolveAndInitPlugins(plugins) {
  return (plugins?(Array.isArray(plugins)?plugins:[plugins]):[])
    .map(pluginCmd => {
        let [plugin, param] = pluginCmd.split(/:(.+)/);
        plugin = resolve.sync(plugin, {basedir: '.'});
        try {
          let pluginModule = require(plugin);
          if (param && pluginModule.init)
            pluginModule.init(param);
        }
        catch (err) {

        }
        return plugin;
      }
    );
}

export async function runPlugins(plugins, pluginFunction, ...params) {
  if (plugins) {
    const pluginsToRun = plugins
      .map(require)
      .filter(plugin => !!plugin[pluginFunction]);
    for (const plugin of pluginsToRun)
      await plugin[pluginFunction](...(params || []));
  }
}