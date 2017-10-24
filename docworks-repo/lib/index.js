import {readDir} from './operations';
export {saveToDir, serviceFromJson, serviceToJson} from './operations';
export merge from './merge';

export function readFromDir(directory) {
  return readDir(directory)
    .then((services) => {
      return {services}
    });
}

