import {serviceToFileName, serviceToDirName, serviceToJson} from './lib/operations';
import fs from 'fs-extra';

export function saveToDir(directory, services) {
  let filesAndServices = services.map(service => {
    let dirName = serviceToDirName(directory, service);
    let fileName = serviceToFileName(directory, service);
    let serviceJson = serviceToJson(service);
    return [dirName, fileName, serviceJson];
  });

  // ensure all directories are created before starting to save files - we do so one after the other
  let dirNames = new Set(filesAndServices.map(_ => _[0]));
  let dirsPromise = [...dirNames].reduce(function(cur, next) {
    return cur.then(fs.ensureDir(next))
  }, Promise.resolve());

  // now we can save files in parallel
  return dirsPromise.then(() => {
    return Promise.all(
      filesAndServices.map(
        (fileAndService) => fs.outputFile(fileAndService[1], fileAndService[2])))
  });
}