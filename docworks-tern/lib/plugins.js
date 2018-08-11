import resolve from 'resolve';

export function resolvePlugins(plugins) {
  return (plugins?(Array.isArray(plugins)?plugins:[plugins]):[])
    .map(pluginCmd => {
        let [plugin, param] = pluginCmd.split(/:(.+)/);
        plugin = resolve.sync(plugin, {basedir: '.'});
        try {
          let pluginModule = require(plugin);
          if (param && pluginModule.init)
            pluginModule.init(param);
          return pluginModule;
        }
        catch (err) {
          throw new Error(`plugins ${plugin} not found`)
        }
      }
    );
}

export function runPlugins(plugins, pluginFunction, extra, tern) {
  extra = extra || {};
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        plugin[pluginFunction](extra[plugin.extendDocworksKey], tern);
      })
  }
}