"use strict";

import tern from './tern-repo';
import fs from 'fs';
import {readFromDir} from 'docworks-repo';

function makeUrlGenerator(url) {
  return function urlGenerator(service, member) {
    let serviceFullName = service.memberOf ? `${service.memberOf}.${service.name}` : service.name;
    if (member)
      return `${url}/${serviceFullName}.html#${member}`;
    else
      return `${url}/${serviceFullName}.html`;
  }
}

export default async function runCli(sources, url, name, outputFileName) {
  let repo = await readFromDir(sources);
  let ternOutput = tern(repo.services, name, makeUrlGenerator(url));
  let ternFileContent =
    `define([], function() { return ${JSON.stringify(ternOutput, null, "\t")}; });`;
  return new Promise((fulfill, reject) => {
    fs.writeFile(outputFileName, ternFileContent, {}, (err) => {
      if (err)
        reject(err);
      else
        fulfill();
    })
  })
}



