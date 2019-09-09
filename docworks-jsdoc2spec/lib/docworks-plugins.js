function handlePlugins(plugins, pluginFunction, doclet, element) {
  let extra = element.extra || {}
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        const pluginResult = plugin[pluginFunction](doclet, element)
        if (pluginResult) {
          let {extraValue, element: newElement} = pluginResult
          if (extraValue)
            extra[plugin.extendDocworksKey] = extraValue
          element = newElement || element
        }
      })
  }
  element.extra = extra
  return element
}

module.exports = handlePlugins
