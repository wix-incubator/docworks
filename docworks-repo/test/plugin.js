

exports.extendDocworksKey = 'thePlugin';

exports.docworksMergeService = function(newValue, repoValue) {
  if (!!newValue && !!repoValue)
    return {
      value: newValue,
      changed: true
    };
  else
    return {changed: false}
};

