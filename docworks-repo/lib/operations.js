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
  labels: {pos: 2},
  get: {pos: 3},
  set: {pos: 4},
  type: {pos: 5},
  locations: Object.assign({pos: 6}, locationSpec),
  docs: Object.assign({pos: 7}, docSpec),
  srcDocs: Object.assign({pos: 8}, docSpec)
};
const paramSpec = {
  name: {pos: 1},
  type: {pos: 2},
  doc: {pos: 3},
  srcDoc: {pos: 4},
  optional: {pos: 5},
  defaultValue: {pos: 6},
  spread: {pos: 7}
};
const operationSpec = {
  name: {pos: 1},
  labels: {pos: 2},
  nameParams: {pos: 3},
  params: Object.assign({pos: 4}, paramSpec),
  ret: {pos: 5, type: {pos: 1}, doc: {pos: 2}, srcDoc: {pos: 3}},
  locations: Object.assign({pos: 6}, locationSpec),
  docs: Object.assign({pos: 7}, docSpec),
  srcDocs: Object.assign({pos: 8}, docSpec)
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
  labels: {pos: 4},
  location: Object.assign({pos: 5}, locationSpec),
  docs: Object.assign({pos: 6}, docSpec),
  srcDocs: Object.assign({pos: 7}, docSpec),
  properties: Object.assign({pos: 8, orderBy:'name'}, propertySpec),
  operations: Object.assign({pos: 9, orderBy:'name'}, operationSpec),
  callbacks: Object.assign({pos: 10, orderBy:'name'}, operationSpec),
  messages: Object.assign({pos: 11, orderBy:'name'}, messageSpec)
};

export function serviceToRepoName(service) {
  let memberOf = (service.memberOf || '').split('.');
  return join(...memberOf, service.name + serviceFileExtension);
}

export function serviceToDirName(directory, service) {
  let memberOf = (service.memberOf || '').split('.');
  return join(directory, ...memberOf);
}

export function serviceToJson(service) {
  return toJson(service, 2, serviceSpec)
}

export function serviceFromJson(json) {
  return fromJson(json, serviceSpec);
}

export async function saveToDir(directory, services) {
  let filesAndServices = services.map(service => {
    let dirName = serviceToDirName(directory, service);
    let repoFileName = serviceToRepoName(service);
    let fullFileName = join(directory, repoFileName);
    let serviceJson = serviceToJson(service);
    return {dirName, fullFileName, repoFileName, serviceJson};
  });

  // ensure all directories are created before starting to save files - we do so one after the other
  let dirNames = new Set(filesAndServices.map(_ => _.dirName));
  let dirsPromise = [...dirNames].reduce(function(cur, next) {
    return cur.then(() => fs.ensureDir(next))
  }, Promise.resolve());

  // now we can save files in parallel
  return dirsPromise.then(() => {
    return Promise.all(
      filesAndServices.map(_ =>
          fs.outputFile(_.fullFileName, _.serviceJson)
            .then(() => _.repoFileName)
      ))
  });
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
      return serviceFromJson(fileContent);
    }
    else return [];
  }));
  return flatten(readFiles);
}

