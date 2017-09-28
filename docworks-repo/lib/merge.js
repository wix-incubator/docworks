import {zipByKey, addUniqueToArray, copy, compareArraysAsSets} from './collection-utils';
import isEqual from 'lodash.isequal';
import {dump} from '../test/util';

function serviceKey(service) {
  return service.memberOf?`${service.memberOf}.${service.name}`:service.name;
}

function compareType(newType, repoType, messages, serviceKey, itemKey) {
  if (!isEqual(newType, repoType)) {
    if (itemKey)
      itemKey = ' ' + itemKey + ' ';
    else
      itemKey = ' ';
    messages.push(`Service ${serviceKey} has changed${itemKey}type`);
    return false;
  }
  return true;
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

function compareDocs(newDocs, repoDocs, messages, key) {
  let summaryEqual = compareAttribute(newDocs.summary, repoDocs.summary, messages, key, 'summary');
  let descriptionEqual = compareAttribute(newDocs.description, repoDocs.description, messages, key, 'description');
  let linksEqual = compareArrays(newDocs.links, repoDocs.links, messages, key, 'link');
  return summaryEqual && descriptionEqual && linksEqual;
}

function mergeProperty(newProperty, repoProperty, messages, key) {
  let changedType = !compareType(newProperty.type, repoProperty.type, messages, key);
  let changedGetter = !compareAttribute(newProperty.get, repoProperty.get, messages, key, 'getter');
  let changedSetter = !compareAttribute(newProperty.set, repoProperty.set, messages, key, 'setter');
  let docsChanged = !compareDocs(newProperty.srcDocs, repoProperty.srcDocs, messages, key);

  let changed = changedType || changedGetter || changedSetter || docsChanged;
  let item = copy(repoProperty, {
    labels: changed?addUniqueToArray(repoProperty.labels, 'changed'): repoProperty.labels,
    type: newProperty.type,
    get: newProperty.get,
    set: newProperty.set,
    srcDocs: copy(newProperty.srcDocs),
    locations: newProperty.locations
  });
  return {changed, item}
}

function mergeLists(newList, repoList, messages, sKey, itemName, mergeItem, addLabels) {
  let zipped = zipByKey(newList, repoList, _ => _.name);
  let changed = false;
  let merged = zipped.map(_ => {
    let newItem = _[0];
    let repoItem = _[1];
    if (newItem && repoItem) {
      var mergedItem = mergeItem(newItem, repoItem, messages, `${sKey} ${itemName} ${newItem.name}`);
      changed = changed || mergedItem.changed;
      return mergedItem.item;
    }
    else if (newItem) {
      let mergedItem = addLabels?
        copy(newItem, {labels: addUniqueToArray(newItem.labels, 'new')}):
        copy(newItem);
      messages.push(`Service ${sKey} has a new ${itemName} ${mergedItem.name}`);
      changed = true;
      return mergedItem;
    }
    else {
      let mergedItem = addLabels?
        copy(repoItem, {labels: addUniqueToArray(repoItem.labels, 'removed')}):
        copy(repoItem);
      messages.push(`Service ${sKey} ${itemName} ${mergedItem.name} was removed`);
      changed = true;
      return mergedItem;
    }
  });
  return {changed, merged}
}

function mergeParam(newParam, repoParam, messages, key) {
  let changedName = newParam.name !== repoParam.name;
  if (changedName) {
    messages.push(`Service ${key} has changed param name from ${repoParam.name} to ${newParam.name}`);
  }
  let changedType = !compareType(newParam.type, repoParam.type, messages, key, `param ${newParam.name}`);
  let changedDoc = !compareAttribute(newParam.doc, repoParam.doc, messages, key, `param ${newParam.name} doc`);

  let changed = changedName || changedType || changedDoc;
  let item = copy(repoParam, {
    name: newParam.name,
    type: newParam.type,
    srcDoc: newParam.srcDoc
  });

  return {changed, item}
}

function mergeParams(newParams, repoParams, messages, key) {
  let changed = newParams.length !== repoParams.length;
  let params = [];
  for (let i = 0; i < Math.min(newParams.length, repoParams.length); i++) {
    let mergedParam = mergeParam(newParams[i], repoParams[i], messages, key);
    changed = changed || mergedParam.changed;
    params.push(mergedParam.item)
  }
  for (let i = newParams.length; i < repoParams.length; i++) {
    messages.push(`Service ${key} param ${repoParams[i].name} was removed`);
  }
  for (let i = repoParams.length; i < newParams.length; i++) {
    messages.push(`Service ${key} has a new param ${newParams[i].name}`);
    params.push(copy(newParams[i]));
  }
  return {changed, params};
}

function mergeOperation(newOperation, repoOperation, messages, key) {
  let paramsMerge = mergeParams(newOperation.params, repoOperation.params, messages, key);
  let changedReturn = !compareType(newOperation.ret.type, repoOperation.ret.type, messages, key, 'return');
  let changedDoc = !compareAttribute(newOperation.ret.doc, repoOperation.ret.doc, messages, key, `return doc`);
  let docsChanged = !compareDocs(newOperation.srcDocs, repoOperation.srcDocs, messages, key);

  let changed = paramsMerge.changed || docsChanged || changedReturn || changedDoc;
  let ret = copy(repoOperation.ret, {
    type: newOperation.ret.type,
    srcDoc: newOperation.ret.srcDoc
  });
  let item = copy(repoOperation, {
    params: paramsMerge.params,
    labels: changed?addUniqueToArray(repoOperation.labels, 'changed'): repoOperation.labels,
    srcDocs: copy(newOperation.srcDocs),
    locations: newOperation.locations,
    ret: ret
  });
  return {changed, item}
}

function mergeMessageMember(newMessageMember, repoMessageMember, messages, key) {
  let changedType = !compareType(newMessageMember.type, repoMessageMember.type, messages, key);
  let docsChanged = !compareAttribute(newMessageMember.srcDocs, repoMessageMember.srcDocs, messages, key, 'doc');

  let changed = changedType || docsChanged;
  let item = copy(repoMessageMember, {
    type: newMessageMember.type,
    docs: newMessageMember.docs
  });
  return {changed, item}
}

function mergeMessage(newMessage, repoMessage, messages, key) {
  let membersMerge = mergeLists(newMessage.members, repoMessage.members, messages, key,
    'member', mergeMessageMember, false);
  let docsChanged = !compareDocs(newMessage.srcDocs, repoMessage.srcDocs, messages, key);

  let changed = membersMerge.changed || docsChanged;
  let item = copy(repoMessage, {
    labels: changed?addUniqueToArray(repoMessage.labels, 'changed'): repoMessage.labels,
    members: membersMerge.merged,
    srcDocs: copy(newMessage.srcDocs),
    locations: newMessage.locations
  });
  return {changed, item}
}

function mergeService(sNew, sRepo, messages) {
  let sKey = serviceKey(sNew);
  let mixesChanged = !compareArrays(sNew.mixes, sRepo.mixes, messages, sKey, 'mixes');
  let docsChanged = !compareDocs(sNew.srcDocs, sRepo.srcDocs, messages, sKey);
  let propertiesMerge = mergeLists(sNew.properties, sRepo.properties, messages, sKey, 'property', mergeProperty, true);
  let operationsMerge = mergeLists(sNew.operations, sRepo.operations, messages, sKey, 'operation', mergeOperation, true);
  let callbacksMerge = mergeLists(sNew.callbacks, sRepo.callbacks, messages, sKey, 'callback', mergeOperation, true);
  let messagesMerge = mergeLists(sNew.messages, sRepo.messages, messages, sKey, 'message', mergeMessage, true);

  let changed = mixesChanged || docsChanged || propertiesMerge.changed || operationsMerge.changed ||
    callbacksMerge.changed || messagesMerge.changed;
  return copy(sRepo, {
    labels: changed?addUniqueToArray(sRepo.labels, 'changed'): sRepo.labels,
    mixes: sNew.mixes,
    srcDocs: copy(sNew.srcDocs),
    location: sNew.location,
    properties: propertiesMerge.merged,
    operations: operationsMerge.merged,
    callbacks: callbacksMerge.merged,
    messages: messagesMerge.merged
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