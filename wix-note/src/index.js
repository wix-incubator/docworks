
exports.defineTags = function(dictionary) {

  dictionary.defineTag('note', {
    mustHaveValue : true,
    canHaveType: false,
    canHaveName : false,
    onTagged: function(doclet, tag) {
      doclet.notes = (doclet.notes || []);
      doclet.notes.push(tag.value);
    }
  });

};

exports.extendDocworksKey = 'notes';

function extendDocworks(doclet) {
  return doclet.notes;
}
exports.extendDocworksService = extendDocworks;
exports.extendDocworksProperty = extendDocworks;
exports.extendDocworksOperation = extendDocworks;
exports.extendDocworksMessage = extendDocworks;

function mergeNotes(newNotes, repoNotes) {
  if (!!newNotes && !!repoNotes && !!newNotes.length && !!repoNotes.length) {
    if (newNotes.length !== repoNotes.length)
      return {value: newNotes, changed: true};
    for (let i=0; i < newNotes.length; i++)
      if (newNotes[i] !== repoNotes[i])
        return {value: newNotes, changed: true};
    return {value: newNotes, changed: false};
  }
  else if (!newNotes && !repoNotes)
    return {value: newNotes, changed: false};
  else
    return {value: newNotes, changed: true};
}

exports.docworksMergeService = mergeNotes;
exports.docworksMergeProperty = mergeNotes;
exports.docworksMergeOperation = mergeNotes;
exports.docworksMergeMessage = mergeNotes;
