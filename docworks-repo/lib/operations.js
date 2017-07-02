import {join} from 'path';
import {toJson} from 'docworks-json';

const serviceFileExtension = '.service.json';

const docSpec = {
  summary: {pos: 1, multiLine:true},
  description: {pos: 2, multiLine:true},
  links: {pos: 3},
  examples: {pos: 4,
    title: {pos: 1, multiLine:true},
    body: {pos: 2, multiLine:true}
  }
};
const locationSpec = {
  filename: {pos: 1},
  lineno: {pos: 2}
};
const propertySpec = {
  name: {pos: 1},
  get: {pos: 2},
  set: {pos: 3},
  type: {pos: 4},
  locations: Object.assign({pos: 5}, locationSpec),
  docs: Object.assign({pos: 6}, docSpec)
};
const paramSpec = {
  name: {pos: 1},
  type: {pos: 2},
  optional: {pos: 3},
  defaultValue: {pos: 4},
  spread: {pos: 5}
};
const operationSpec = {
  name: {pos: 1},
  nameParams: {pos: 2},
  params: Object.assign({pos: 3}, paramSpec),
  ret: {pos: 4},
  locations: Object.assign({pos: 5}, locationSpec),
  docs: Object.assign({pos: 6}, docSpec)
};
const messageSpec = {
  name: {pos: 1},
  locations: Object.assign({pos: 2}, locationSpec),
  docs: Object.assign({pos: 3}, docSpec),
  members: {pos: 4,
    name: {pos: 1},
    type: {pos: 2}
  }
};
const serviceSpec = {
  name: {pos: 1},
  memberOf: {pos: 2},
  mixes: {pos: 3},
  location: Object.assign({pos: 4}, locationSpec),
  docs: Object.assign({pos: 5}, docSpec),
  properties: Object.assign({pos: 6}, propertySpec),
  operations: Object.assign({pos: 7}, operationSpec),
  callbacks: Object.assign({pos: 8}, operationSpec),
  messages: Object.assign({pos: 9}, messageSpec)
};

export function serviceToFileName(directory, service) {
  let name = service.name;
  let memberOf = (service.memberOf || '').split('.');
  return join(directory, ...memberOf, name + serviceFileExtension);
}

export function serviceToDirName(directory, service) {
  let memberOf = (service.memberOf || '').split('.');
  return join(directory, ...memberOf);
}

export function serviceToJson(service) {
  return toJson(service, 4, serviceSpec)
}

