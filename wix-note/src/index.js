
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