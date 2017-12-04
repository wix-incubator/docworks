function fixTypeName(type) {
  return type.replace('external:', '');
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

exports.handlers = {
  newDoclet: function(e) {
    if (e.doclet.kind === 'function'){
      fixTypes(e.doclet, 'params');
      fixTypes(e.doclet, 'returns');
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
