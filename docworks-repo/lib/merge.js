import {zipByKey, addUniqueToArray, copy, compareArraysAsSets} from './collection-utils';

function serviceKey(service) {
  return service.memberOf?`${service.memberOf}.${service.name}`:service.name;
}

function compareArrays(sNewArr, sRepoArr, messages, serviceKey, attribute) {
  let compareResult = compareArraysAsSets(sNewArr, sRepoArr);
  for (let item of compareResult.onlyIn1)
    messages.push(`Service ${serviceKey} has a new ${attribute} ${item}`)
  for (let item of compareResult.onlyIn2)
    messages.push(`Service ${serviceKey} ${attribute} ${item} was removed`)
  return compareResult.equal;
}

function compareAttribute(sNewValue, sRepoValue, messages, key, attribute) {
  if (sNewValue !== sRepoValue) {
    messages.push(`Service ${key} has changed ${attribute}`);
    return false;
  }
  return true;
}

function mergeProperty(newProperty, repoProperty, messages, key) {
  let changedType = !compareAttribute(newProperty.type, repoProperty.type, messages, key, 'type');
  let changed = changedType;
  let property = copy(repoProperty, {
    labels: changed?addUniqueToArray(repoProperty.labels, 'changed'): repoProperty.labels,
    type: newProperty.type
  });
  return {changed, property}
}

function mergePropeties(sNewProperties, sRepoProperties, messages, sKey) {
  let zippedProperties = zipByKey(sNewProperties, sRepoProperties, _ => _.name);
  let changed = false;
  let properties = zippedProperties.map(_ => {
    let pNew = _[0];
    let pRepo = _[1];
    if (pNew && pRepo) {
      var mergedProperty = mergeProperty(pNew, pRepo, messages, `${sKey} property ${pNew.name}`);
      changed = changed || mergedProperty.changed;
      return mergedProperty.property;
    }
    else if (pNew) {
      let newProperty = copy(pNew, {labels: addUniqueToArray(pNew.labels, 'new')});
      messages.push(`Service ${sKey} has a new property ${newProperty.name}`);
      changed = true;
      return newProperty;
    }
    else {
      let removedProperty = copy(pRepo, {labels: addUniqueToArray(pRepo.labels, 'removed')});
      messages.push(`Service ${sKey} property ${removedProperty.name} was removed`);
      changed = true;
      return removedProperty;
    }
  });
  return {changed, properties}
}

function mergeService(sNew, sRepo, messages) {
  let sKey = serviceKey(sNew);
  let mixesChanged = !compareArrays(sNew.mixes, sRepo.mixes, messages, sKey, 'mixes');
  let summaryChanged = !compareAttribute(sNew.srcDocs.summary, sRepo.srcDocs.summary, messages, sKey, 'summary');
  let descriptionChanged = !compareAttribute(sNew.srcDocs.description, sRepo.srcDocs.description, messages, sKey, 'description');
  let linksChanged = !compareArrays(sNew.srcDocs.links, sRepo.srcDocs.links, messages, sKey, 'link');
  let propertiesMerge = mergePropeties(sNew.properties, sRepo.properties, messages, sKey);

  let changed = mixesChanged || summaryChanged || descriptionChanged || linksChanged || propertiesMerge.changed;
  return copy(sRepo, {
    labels: changed?addUniqueToArray(sRepo.labels, 'changed'): sRepo.labels,
    mixes: sNew.mixes,
    srcDocs: copy(sNew.srcDocs),
    location: sNew.location,
    properties: propertiesMerge.properties
  });
}

export default function merge(newRepo, repo) {
  let zippedServices = zipByKey(newRepo, repo, serviceKey);
  let messages = [];
  let updatedRepo = zippedServices.map(_ => {
    let sNew = _[0];
    let sRepo = _[1];
    if (sNew && sRepo) {
      return mergeService(sNew, sRepo, messages);
    }
    else if (sNew) {
      let newService = copy(sNew, {labels: addUniqueToArray(sNew.labels, 'new')});
      messages.push(`Service ${serviceKey(newService)} is new`);
      return newService;
    }
    else {
      let removedService = copy(sRepo, {labels: addUniqueToArray(sRepo.labels, 'removed')});
      messages.push(`Service ${serviceKey(removedService)} was removed`);
      return removedService;
    }
  });
  return {repo: updatedRepo, messages}

}