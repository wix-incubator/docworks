export default function asPromise(git, gitFunc) {
  return function() {
    let args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push((err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      });
      gitFunc.apply(git, args);
    });
  }
}
