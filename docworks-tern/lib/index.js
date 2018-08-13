"use strict";

import tern from './tern-repo';

function makeUrlGenerator(url) {
  return function urlGenerator(service, member) {
    let serviceFullName = service.memberOf ? `${service.memberOf}.${service.name}` : service.name;
    if (member)
      return `${url}/${serviceFullName}.html#${member}`;
    else
      return `${url}/${serviceFullName}.html`;
  }
}

export default function runTern(services, baseUrl, apiName, plugins) {
  let ternOutput = tern(services, apiName, makeUrlGenerator(baseUrl), plugins);
  return JSON.stringify(ternOutput, null, "\t");
}









