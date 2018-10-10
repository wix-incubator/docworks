var fs = require('fs');
module.exports.ecpAfterMerge = function(workingDir, projectSubdir) {
  fs.writeFile(workingDir + '/' + projectSubdir + '/created-by-plugin', "this file was created by a plugin", function(err) {
    if(err) {
      return console.log(err);
    }
  });
};