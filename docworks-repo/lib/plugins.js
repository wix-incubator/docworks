
export function loadPlugins(plugins) {
  return (plugins || []).map(require)
}

export function runPlugins(plugins, pluginFunction, newExtra, repoExtra, messages, sKey) {
  let extra = Object.assign({}, newExtra);
  let extraChanged = false;
  let hasExtra = !!newExtra;
  if (plugins) {
    plugins.filter(plugin => !!plugin[pluginFunction] && !!plugin.extendDocworksKey)
      .forEach(plugin => {
        let {changed, value} = plugin[pluginFunction](newExtra[plugin.extendDocworksKey], repoExtra[plugin.extendDocworksKey]);
        if (value) {
          extra[plugin.extendDocworksKey] = value;
          hasExtra = true;
        }
        if (changed)
          messages.push(`Service ${sKey} has changed extra.${plugin.extendDocworksKey}`);
        extraChanged = extraChanged || changed;
      })
  }
  return {changed: extraChanged, merged: extra};
}