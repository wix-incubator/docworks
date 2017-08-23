import {serviceToFileName, serviceToDirName, serviceToJson, readDir, zipByName} from './lib/operations';
export merge from './lib/merge';
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

