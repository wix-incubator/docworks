import path from 'path';
import fs from 'fs';

function getResourcePath(dirname) {
  return ['', process.cwd(), __dirname]
    .map(basePath => path.resolve(basePath, dirname))
    .find(dirPath => fs.existsSync(dirPath));

  // ['', process.cwd()].forEach(basePath => {
  //   let dirPath = path.resolve(basePath, dirname);
  //   if (fs.existsSync(dirPath))
  //     return dirPath
  // });
  // return undefined;
}

function resolvePluginPath(plugin) {
  let basename = path.basename(plugin);
  let dirname = path.dirname(plugin);
  let pluginPath = getResourcePath(dirname);

  if (!pluginPath) {
    throw new Error(`Unable to find the plugin ${plugin}`);
  }

  return path.join(pluginPath, basename)
}

export function loadPlugins(plugins) {
  return (plugins || [])
    .map(resolvePluginPath)
    .map(require)
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