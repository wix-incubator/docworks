function fixTypeName(type) {
  return type.replace('external:', '');
}

function fixType(aType) {
  if (aType.names)
    return {names: aType.names.map(fixTypeName)};
  else
    return aType;
}

function fixTypes(doclet, typesArrayName) {
  if (doclet[typesArrayName])
    doclet[typesArrayName] = doclet[typesArrayName].map(aType => {
      if (aType.type && aType.type.names)
        return Object.assign(aType, {
          type: {names: aType.type.names.map(fixTypeName)}
        });
      else
        return aType;
    })
}

function fixReturnPromise(doclet) {
  if (doclet.returns && doclet.returns.length === 1 && doclet.returns[0].type &&
    doclet.returns[0].type.names && doclet.returns[0].type.names.length ===1 && doclet.returns[0].type.names[0] === 'Promise') {
    if (doclet.reject || doclet.fulfill) {
      if (doclet.fulfill && doclet.fulfill.type) {
        let type = fixType(doclet.fulfill.type);
        doclet.returns[0].type.names[0] = `Promise.<${type.names.join('|')}>`;
        if (doclet.fulfill.description)
          doclet.returns[0].description = doclet.returns[0].description + '. on fulfilled - ' + doclet.fulfill.description;
      }
      if (doclet.reject)
        if (doclet.reject.description)
          doclet.returns[0].description = doclet.returns[0].description + '. on rejected - ' + doclet.reject.description;
    }
  }
}

exports.handlers = {
  newDoclet: function(e) {
    if (e.doclet.kind === 'function'){
      fixTypes(e.doclet, 'params');
      fixTypes(e.doclet, 'returns');
      fixReturnPromise(e.doclet);
    }
    else if (e.doclet.kind === 'typedef') {
      fixTypes(e.doclet, 'params');
      fixTypes(e.doclet, 'properties');
    }
    else if (e.doclet.kind === 'member') {
      if (e.doclet.type && e.doclet.type.names)
        e.doclet.type.names = e.doclet.type.names.map(fixTypeName)
    }
  }
};

exports.defineTags = function(dictionary) {
  dictionary.defineTag('reject', {
    mustHaveValue : true,
    canHaveType: true,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      doclet.reject = tag.value;
    }
  });

  dictionary.defineTag('fulfill', {
    mustHaveValue : true,
    canHaveType: true,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      doclet.fulfill = tag.value;
    }
  });
};

