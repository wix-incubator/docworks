function fixTypeName(type) {
  return type.replace('external:', '');
}

// {names: ['name', 'name']}
function fixType(aType) {
  if (aType.names)
    return {names: aType.names.map(fixTypeName)};
  else
    return aType;
}

// [{type: {names: ['name', 'name']}}, {type: {names: ['name', 'name']}}]
function fixTypes(doclet, typesArrayName) {
  if (doclet[typesArrayName])
    doclet[typesArrayName] = doclet[typesArrayName].map(aType => {
      if (aType.type && aType.type.names)
        return Object.assign(aType, {
          type: fixType(aType.type)
        });
      else
        return aType;
    })
}

function fixReturnPromise(doclet) {
  if (doclet.returns && doclet.returns.length === 1 && doclet.returns[0].type &&
    doclet.returns[0].type.names && doclet.returns[0].type.names.length ===1 && doclet.returns[0].type.names[0] === 'Promise') {
    if (doclet.reject || doclet.fulfill) {
      let doc = [];
      if (doclet.returns[0].description)
        doc.push(doclet.returns[0].description);

      if (doclet.fulfill && doclet.fulfill.type) {
        let type = fixType(doclet.fulfill.type);
        doclet.returns[0].type.names[0] = `Promise.<${type.names.join('|')}>`;
        if (doclet.fulfill.description)
          doc.push('on fulfilled - ' + doclet.fulfill.description);
      }
      if (doclet.reject)
        if (doclet.reject.description)
          doc.push('on rejected - ' + doclet.reject.description);

      doclet.returns[0].description = doc.join('. ');
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
      fixTypes(e.doclet, 'returns');
      fixReturnPromise(e.doclet);
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

