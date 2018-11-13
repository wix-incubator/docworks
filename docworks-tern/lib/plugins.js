export function runPlugins(plugins, pluginFunction, extra, tern, path) {
  extra = extra || {};
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        plugin[pluginFunction](extra[plugin.extendDocworksKey], tern, path);
      })
  }
}