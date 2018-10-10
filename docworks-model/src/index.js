

export function Service(name, memberOf, mixes, labels, properties, operations, callbacks, messages, location, docs, extra) {
  return {
    name: name,
    memberOf: memberOf,
    mixes: mixes,
    labels: labels,
    properties: properties,
    operations: operations,
    callbacks: callbacks,
    messages: messages,
    location: location,
    docs: docs,
    extra: extra || {}
  }
}

export const Void = 'void';
export const Any = '*';

export function Docs(summary, description, links, examples, extra) {
  return {
    summary: summary,
    description: description,
    links: links,
    examples: examples,
    extra: extra || {}
  }
}

export function Example(title, body, extra) {
  return {
    title: title,
    body: body,
    extra: extra || {}
  }
}

export function Return(type, doc) {
  return {
    type: type,
    doc: doc
  }
}

export function Operation(name, labels, nameParams, params, ret, locations, docs, extra) {
  return {
    name: name,
    nameParams: nameParams,
    labels: labels,
    params: params,
    ret: ret,
    locations: locations,
    docs: docs,
    extra: extra || {}
  }
}

export function Param(name, type, doc, optional, defaultValue, spread) {
  return {
    name: name,
    type: type,
    doc: doc,
    optional: optional,
    defaultValue: defaultValue,
    spread: spread
  }
}

export function Property(name, labels, isGet, isSet, type, defaultValue, locations, docs, extra) {
  return {
    name: name,
    labels: labels,
    get: isGet,
    set: isSet,
    type: type,
    defaultValue: defaultValue,
    locations: locations,
    docs: docs,
    extra: extra || {}
  }
}

export function Message(name, labels, members, locations, docs, extra) {
  return {
    name: name,
    labels: labels,
    members: members,
    locations: locations,
    docs: docs,
    extra: extra || {}
  }
}

export function MessageMember(name, type, doc, optional) {
  return {
    name: name,
    type: type,
    doc: doc,
    optional: optional
  }
}

export function AtomicType(name) {
  return name;
}

export function UnionType(names) {
  return names;
}

export function GeneticType(name, typeParams) {
  return {
    name: name,
    typeParams: typeParams
  };
}

export function Location(filename, lineno) {
  return {
    filename: filename,
    lineno: lineno
  }
}

export function JsDocError(message, locations) {
  const groupByFile = (groups, location) => {
    if (groups[location.filename])
      groups[location.filename].push(location);
    else
      groups[location.filename] = [location];
    return groups;
  };

  let files = locations.reduce(groupByFile, {});
  let fileLocations = Object.keys(files)
    .map((group) => {
      let linenos = files[group].map(location => location.lineno);
      return `${group} (${linenos.join(", ")})`;
    })
    .join(", ");
  return {
    message: message,
    location: fileLocations
  }
}