import {inspect} from 'util';
export function dump() {
    let args = Array.prototype.slice.call(arguments);
    console.log(...args.map(arg => {
        return inspect(arg, {colors: true, depth: 5})
    }));
}