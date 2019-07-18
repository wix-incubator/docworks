var fs = require('fs')
module.exports.ecpAfterMerge = function(workingDir, projectSubdir) {
  fs.writeFile(workingDir + '/' + projectSubdir + '/created-by-plugin', 'this file was created by a plugin', function(err) {
    if(err) {
      // eslint-disable-next-line no-console
      return console.log(err)
    }
  })
}
