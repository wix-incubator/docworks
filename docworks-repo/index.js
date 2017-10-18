import {readDir} from './lib/operations';
export {saveToDir, serviceFromJson, serviceToJson} from './lib/operations';
export merge from './lib/merge';

export function readFromDir(directory) {
  return readDir(directory)
    .then((services) => {
      return {services}
    });
}

