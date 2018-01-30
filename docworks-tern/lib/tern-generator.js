
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

function trimPara(text) {
  if(text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '');
  }
  return '';
}

export function propTern(service, prop, urlGenerator) {
  let tern = {};
  tern[prop.name] = {
      "!type": typeTern(prop.type),
      "!doc": trimPara(prop.srcDocs.summary),
      "!url": urlGenerator(service, prop.name)
    };

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
    "!doc": trimPara(operation.srcDocs.summary),
    "!url": urlGenerator(service, operation.name)
  };

  return tern;
}

export function messageTern(service, message, urlGenerator) {
  let tern = {};

  const messageUrl = urlGenerator(service, message.name);
  tern[message.name] = {
    "!doc": trimPara(message.srcDocs.summary),
    "!url": messageUrl
  };

  message.members.forEach(member => {
     tern[message.name][member.name] = {
       "!type": typeTern(member.type),
       "!doc": trimPara(member.srcDocs),
       "!url": messageUrl
     }
  });

  return tern;
}

export function ternService(service, urlGenerator, findCallback, findMixin) {
  let tern = {};

  tern[service.name] = {
    "!doc": trimPara(service.srcDocs.summary),
    "!url": urlGenerator(service)
  };

  let parentServices = [service];
  let gatherMixes = mix => {
    let mixinService = findMixin(mix);
    if (mixinService) {
      parentServices.push(mixinService);
      mixinService.mixes.forEach(gatherMixes);
    }
  };
  service.mixes.forEach(gatherMixes);

  let servicePrototype = tern[service.name]["prototype"] = {};

  parentServices.forEach(parentService => {
    parentService.properties.forEach(prop => {
      Object.assign(servicePrototype, propTern(service, prop,urlGenerator));
    });
    parentService.operations.forEach(operation => {
      Object.assign(servicePrototype, operationTern(service, operation,urlGenerator, findCallback));
    });
    parentService.messages.forEach(message => {
      Object.assign(servicePrototype, messageTern(service, message,urlGenerator));
    });
  });

  return tern;
}