

exports.extendDocworksKey = 'thePlugin';

function mergeThePlugin(newValue, repoValue) {
  if (!!newValue && !!repoValue)
    return {
      value: newValue,
      changed: true
    };
  else
    return {changed: false}
}

exports.docworksMergeService = mergeThePlugin;

exports.docworksMergeProperty = mergeThePlugin;

exports.docworksMergeOperation = mergeThePlugin;

exports.docworksMergeMessage = mergeThePlugin;

exports.docworksMergeDocs = mergeThePlugin;

exports.docworksMergeExample = mergeThePlugin;
