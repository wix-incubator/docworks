import {serviceToFileName, serviceToDirName, serviceToJson, readDir, zipByName} from './lib/operations';
import fs from 'fs-extra';

export async function saveToDir(directory, services) {
  let filesAndServices = services.map(service => {
    let dirName = serviceToDirName(directory, service);
    let fileName = serviceToFileName(directory, service);
    let serviceJson = serviceToJson(service);
    return [dirName, fileName, serviceJson];
  });

  // ensure all directories are created before starting to save files - we do so one after the other
  let dirNames = new Set(filesAndServices.map(_ => _[0]));
  let dirsPromise = [...dirNames].reduce(function(cur, next) {
    return cur.then(() => fs.ensureDir(next))
  }, Promise.resolve());

  // now we can save files in parallel
  return dirsPromise.then(() => {
    return Promise.all(
      filesAndServices.map(
        (fileAndService) => fs.outputFile(fileAndService[1], fileAndService[2])))
  });
}

export function readFromDir(directory) {
  return readDir(directory)
    .then((services) => {return {
      services
    }});
}

export function merge(newRepo, repo) {
  // todo zip by name and memberof
  let zippedServices = zipByName(newRepo, repo, 'name');
  let messages = [];
  let updatedRepo = zippedServices.map(_ => {
    if (_[0] && _[1]) {
      return Object.assign({}, _[1]);
    }
    else if (_[0]) {
      let newService = Object.assign({}, _[0]);
      // todo set labels by model
      newService.labels = ['new'];
      messages.push(`Service ${newService.name} is new`);
      return newService;
    }
    else {
      let removedService = Object.assign({}, _[1]);
      removedService.labels = ['removed'];
      messages.push(`Service ${removedService.name} was removed`);
      return removedService;
    }
  });
  return {repo: updatedRepo, messages}
}
