

export default function handlePlugins(plugins, pluginFunction, doclet) {
  let extra = {};
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction])
      .forEach(plugin => {
        extra = Object.assign(extra, plugin[pluginFunction](doclet))
      })
  }
  return extra;
}