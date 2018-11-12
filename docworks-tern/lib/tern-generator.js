import {runPlugins} from './plugins';

const builtInTypes = {
  'string': 'string',
  'boolean': 'bool',
  'number': 'number',
  'Object': 'obj',
  'Date': '+Date' // date is redundant here - it is only here for clarity
};

export function typeTern(type) {
  if (typeof type === 'string') {
    if (builtInTypes[type])
      return builtInTypes[type];
    else
      return `+${validTernName(type)}`;
  }
  else if (typeof type === 'object' && type.name) {
    if (type.name === 'Array') {
      return `[${typeTern(type.typeParams[0])}]`;
    }
    else if (type.name === 'Promise') {
      return `+Promise[:t=${typeTern(type.typeParams[0])}]`;
    }
  }
  else if (Array.isArray(type) && type.length > 0) {
    return typeTern(type[0]);  
  }
}

export function validTernName(name) {
  return name.replace(/[^\w$<>\.:!]/g, '_');
}

function trimPara(text) {
  if(text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '');
  }
  return '';
}

export function propTern(service, prop, urlGenerator, plugins) {
  let tern = {};
  const propName = validTernName(prop.name);
  tern[propName] = {
      "!type": typeTern(prop.type),
      "!doc": trimPara(prop.docs.summary),
      "!url": urlGenerator(service, propName)
    };

  runPlugins(plugins, 'ternProperty', prop.extra, tern[propName]);

  return tern;
}

function complexType(typeName) {
  return typeof typeName !== 'string';
}

function formatFunctionTern(operation, findCallback) {
  let params = '';
  if (operation.params && operation.params.length)
    params = operation.params.map(param => {
      let callback = !builtInTypes[param.type] && !complexType(param.type) && findCallback(param.type);
      if (callback)
        return `${validTernName(param.name)}: ${validTernName(param.type)}`;
      else
        return `${validTernName(param.name)}: ${typeTern(param.type)}`
    }).join(', ');

  let ret = '';
  if (operation.ret && operation.ret.type !== 'void')
    ret = ` -> ${typeTern(operation.ret.type)}`;

  return `fn(${params})${ret}`;
}

export function operationTern(service, operation, urlGenerator, findCallback, plugins) {
  let tern = {};

  const operationName = validTernName(operation.name);
  tern[operationName] = {
    "!type": formatFunctionTern(operation, findCallback),
    "!doc": trimPara(operation.docs.summary),
    "!url": urlGenerator(service, operationName)
  };

  runPlugins(plugins, 'ternOperation', operation.extra, tern[operationName]);

  return tern;
}

export function messageTern(service, message, urlGenerator, plugins) {
  let tern = {};

  const messageName = validTernName(message.name);
  const messageUrl = urlGenerator(service, messageName);
  tern[messageName] = {
    "!doc": trimPara(message.docs.summary),
    "!url": messageUrl
  };

  message.members.forEach(member => {
    tern[messageName][validTernName(member.name)] = {
       "!type": typeTern(member.type),
       "!doc": trimPara(member.docs),
       "!url": messageUrl
     }
  });

  runPlugins(plugins, 'ternMessage', message.extra, tern[messageName]);

  return tern;
}

export function ternService(service, urlGenerator, findCallback, findMixin, plugins) {
  let tern = {};

  const serviceName = validTernName(service.name);
  tern[serviceName] = {
    "!doc": trimPara(service.docs.summary),
    "!url": urlGenerator(service)
  };

  let parentServices = [service];
  let gatherMixes = mix => {
    let mixinService = findMixin(mix);
    if (mixinService) {
      parentServices.unshift(mixinService);
      mixinService.mixes.forEach(gatherMixes);
    }
  };
  service.mixes.forEach(gatherMixes);

  let servicePrototype = tern[serviceName]["prototype"] = {};

  parentServices.forEach(parentService => {
    parentService.properties.forEach(prop => {
      Object.assign(servicePrototype, propTern(service, prop,urlGenerator, plugins));
    });
    parentService.operations.forEach(operation => {
      Object.assign(servicePrototype, operationTern(service, operation, urlGenerator, findCallback, plugins));
    });
  });
  service.callbacks.forEach(callback => {
    Object.assign(tern[serviceName], operationTern(service, callback, urlGenerator, findCallback, plugins));
  });
  service.messages.forEach(message => {
    Object.assign(tern[serviceName], messageTern(service, message,urlGenerator, plugins));
  });

  return tern;
}