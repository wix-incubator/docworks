exports.defineTags = function(dictionary) {
  dictionary.defineTag('overrideSummary', {
    mustHaveValue : true,
    canHaveType: false,
    canHaveName : true,
    onTagged: function(doclet, tag) {
      doclet.summary = tag.text;
    }
  });
};