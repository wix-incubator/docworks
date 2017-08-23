import {join} from 'path';
import {toJson, fromJson} from 'docworks-json';
import fs from 'fs-extra';
import flatten from 'array-flatten';

const serviceFileExtension = '.service.json';

const docSpec = {
  summary: {pos: 1},
  description: {pos: 2, multiLine:true},
  links: {pos: 3},
  examples: {pos: 4,
    title: {pos: 1},
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
  docs: Object.assign({pos: 6}, docSpec),
  srcDocs: Object.assign({pos: 7}, docSpec)
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
  docs: Object.assign({pos: 6}, docSpec),
  srcDocs: Object.assign({pos: 7}, docSpec)
};
const messageSpec = {
  name: {pos: 1},
  locations: Object.assign({pos: 2}, locationSpec),
  docs: Object.assign({pos: 3}, docSpec),
  srcDocs: Object.assign({pos: 4}, docSpec),
  members: {pos: 5,
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
  srcDocs: Object.assign({pos: 6}, docSpec),
  properties: Object.assign({pos: 7, orderBy:'name'}, propertySpec),
  operations: Object.assign({pos: 8, orderBy:'name'}, operationSpec),
  callbacks: Object.assign({pos: 9, orderBy:'name'}, operationSpec),
  messages: Object.assign({pos: 10, orderBy:'name'}, messageSpec)
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
  return toJson(service, 2, serviceSpec)
}


// link - how to use async await https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
export async function readDir(dir) {
  let files = await fs.readdir(dir);
  let readFiles = await Promise.all(files.map(async (file) => {
    let stat = await fs.stat(join(dir, file));
    if (stat.isDirectory())
      return await readDir(join(dir, file));
    else if (file.endsWith(serviceFileExtension)){
      let fileContent = await fs.readFile(join(dir, file), 'utf8');
      return fromJson(fileContent, serviceSpec);
    }
    else return [];
  }));
  return flatten(readFiles);
}

export function zipByName(arr1, arr2, name) {
  let dict = {};
  let res = [];
  arr1.forEach(_1 => dict[_1[name]] = _1);
  arr2.forEach(_2 => {
    if (dict[_2[name]]) {
      res.push([dict[_2[name]],_2]);
      delete dict[_2[name]];
    }
    else {
      res.push([,_2]);
    }
  });
  for (name in dict) {
    res.push([dict[name],]);
  }
  return res;
}
