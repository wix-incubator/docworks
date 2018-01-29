import {ternService} from './tern-generator';

export default function tern(repo, apiName, urlGenerator) {
  let ternModel = {};

  let findMixin = (fullName) => {
    let memberOf = fullName.substring(0, fullName.lastIndexOf("."));
    let name = fullName.substring(fullName.lastIndexOf(".") + 1, fullName.length);
    if (memberOf)
      return repo.services.find(_ => _.name === name && _.memberOf === memberOf);
    else
      return repo.services.find(_ => _.name === name && !_.memberOf);
  };

  let findCallback = (fullName) => {
    let callbackName = fullName.substring(fullName.lastIndexOf(".") + 1, fullName.length);
    let serviceFullName = fullName.substring(0, fullName.lastIndexOf("."));
    let service = findMixin(serviceFullName);
    if (service)
      return service.callbacks.find(_ => _.name === callbackName);
    else
      return undefined;
  };


  repo.services.forEach(service => {
    let serviceTern = ternService(service, urlGenerator, findCallback, findMixin);
    let ternParent = ternModel;
    let namespaces = (service.memberOf || '').split('.');
    namespaces.forEach(namespace => {
      if (namespace)
        ternParent = ternParent[namespace] = ternParent[namespace] || {};
    });
    Object.assign(ternParent, serviceTern);

  });

  return {
    "!define": ternModel,
    "!name": apiName
  };
}