

export default function handlePlugins(plugins, pluginFunction, doclet) {
  let extra = {};
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        let extraValue = plugin[pluginFunction](doclet);
        if (extraValue)
          extra[plugin.extendDocworksKey] = extraValue;
      })
  }
  return extra;
}