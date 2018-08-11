import {ternService, validTernName} from './tern-generator';

function mergeObjects(path, object1, object2) {
  if (typeof object1 !== 'object' && typeof object2 !== 'object')
    throw new Error(`failed merging services, found ${typeof object1} and ${typeof object2} at ${path}`);

  for (let key in object2) {
    if (typeof object1[key] === 'object' && typeof object2[key] === 'object') {
      object1[key] = mergeObjects(`${path}.${key}`, object1[key], object2[key]);
    } else {
      object1[key] = object2[key];
    }
  }
  return object1;
}

export default function tern(services, apiName, urlGenerator, plugins) {
  let ternModel = {};

  let findService = (fullName) => {
    let memberOf = fullName.substring(0, fullName.lastIndexOf("."));
    let name = fullName.substring(fullName.lastIndexOf(".") + 1, fullName.length);
    if (memberOf)
      return services.find(_ => _.name === name && _.memberOf === memberOf);
    else
      return services.find(_ => _.name === name && !_.memberOf);
  };

  let findCallback = (fullName) => {
    let callbackName = fullName.substring(fullName.lastIndexOf(".") + 1, fullName.length);
    let serviceFullName = fullName.substring(0, fullName.lastIndexOf("."));
    let service = findService(serviceFullName);
    if (service)
      return service.callbacks.find(_ => _.name === callbackName);
    else
      return undefined;
  };

  services.forEach(service => {
    let serviceTern = ternService(service, urlGenerator, findCallback, findService, plugins);
    let ternParent = ternModel;
    let namespaces = (service.memberOf || '')
      .split('.')
      .map(validTernName);
    namespaces.forEach(namespace => {
      if (namespace)
        ternParent = ternParent[namespace] = ternParent[namespace] || {};
    });
    mergeObjects('', ternParent, serviceTern);

  });

  return {
    "!define": ternModel,
    "!name": apiName
  };
}