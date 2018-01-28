
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
      return `+${type}`;
  }
  else if (typeof type === 'object' && type.name) {
    if (type.name === 'Array') {
      return `[${typeTern(type.typeParams[0])}]`;
    }
    else if (type.name === 'Promise') {
      return `+Promise[value=${typeTern(type.typeParams[0])}]`;
    }
  }
}

export function propTern(service, prop, urlGenerator) {
  let tern = {};
  tern[prop.name] = {
      "!type": typeTern(prop.type),
      "!doc": prop.srcDocs.summary,
      "!url": urlGenerator(service.name, prop.name)
    };

  return tern;
}

function formatFunctionTern(operation, findCallback) {
  let params = '';
  if (operation.params && operation.params.length)
    params = operation.params.map(param => {
      let callback = findCallback(param.type);
      if (callback)
        return `${param.name}: ${formatFunctionTern(callback, findCallback)}`;
      else
        return `${param.name}: ${typeTern(param.type)}`
    }).join(', ');

  let ret = '';
  if (operation.ret && operation.ret.type !== 'void')
    ret = ` -> ${typeTern(operation.ret.type)}`;

  return `fn(${params})${ret}`;
}

export function operationTern(service, operation, urlGenerator, findCallback) {
  let tern = {};

  tern[operation.name] = {
    "!type": formatFunctionTern(operation, findCallback),
    "!doc": operation.srcDocs.summary,
    "!url": urlGenerator(service.name, operation.name)
  };

  return tern;
}