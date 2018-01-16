
const builtInTypes = {
  'string': 'string',
  'boolean': 'bool',
  'number': 'number',
  'Object': 'obj'
};

export function typeTern(type) {
  if (typeof type === 'string') {
    if (builtInTypes[type])
      return builtInTypes[type];
    else
      return type;
  }
  else if (typeof type === 'object') {
    if (type.name && type.name === 'Array') {
      return `[${type.typeParams[0]}]`;
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