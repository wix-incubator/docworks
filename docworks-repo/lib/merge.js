import {zipByKey, addUniqueToArray, copy, compareArraysAsSets} from './collection-utils';

function serviceKey(service) {
  return service.memberOf?`${service.memberOf}.${service.name}`:service.name;
}

function compareMixes(sNewMixes, sRepoMixes, messages, serviceKey) {
  let compareResult = compareArraysAsSets(sNewMixes, sRepoMixes);
  for (let item of compareResult.onlyIn1)
    messages.push(`Service ${serviceKey} has new mixes ${item}`)
  for (let item of compareResult.onlyIn2)
    messages.push(`Service ${serviceKey} mixes ${item} was removed`)
  return compareResult.equal;
}

function compareLinks(sNewLinks, sRepoLinks, messages, serviceKey) {
  let compareResult = compareArraysAsSets(sNewLinks, sRepoLinks);
  for (let item of compareResult.onlyIn1)
    messages.push(`Service ${serviceKey} has a new link ${item}`)
  for (let item of compareResult.onlyIn2)
    messages.push(`Service ${serviceKey} link ${item} was removed`)
  return compareResult.equal;
}

function compareAttribute(sNewValue, sRepoValue, messages, sKey, attribute) {
  if (sNewValue !== sRepoValue) {
    messages.push(`Service ${sKey} has changed ${attribute}`);
    return false;
  }
  return true;
}

function mergeService(sNew, sRepo, messages) {
  let sKey = serviceKey(sNew);
  let mixesChanged = !compareMixes(sNew.mixes, sRepo.mixes, messages, sKey);
  let summaryChanged = !compareAttribute(sNew.srcDocs.summary, sRepo.srcDocs.summary, messages, sKey, 'summary');
  let descriptionChanged = !compareAttribute(sNew.srcDocs.description, sRepo.srcDocs.description, messages, sKey, 'description');
  let linksChanged = !compareLinks(sNew.srcDocs.links, sRepo.srcDocs.links, messages, sKey);

  let changed = mixesChanged || summaryChanged || descriptionChanged || linksChanged;
  return copy(sRepo, {
    labels: changed?addUniqueToArray(sRepo.labels, 'changed'): sRepo.labels,
    mixes: sNew.mixes,
    srcDocs: copy(sNew.srcDocs),
    location: sNew.location
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