const {inspect} = require('util')
function dump() {
    let args = Array.prototype.slice.call(arguments)
    // eslint-disable-next-line no-console
    console.log(...args.map(arg => {
        return inspect(arg, {colors: true, depth: 5})
    }))
}

module.exports = {
    dump
}
