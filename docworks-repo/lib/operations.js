import {join} from 'path';
import {toJson, fromJson} from 'docworks-json';
import fs from 'fs-extra';
import flatten from 'array-flatten';
import {serviceSpec} from './serviceSpecModel';

const serviceFileExtension = '.service.json';

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
  if (! await fs.pathExists(dir))
    return [];
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

