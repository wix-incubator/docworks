import {Void, Location} from 'swank-model';

export function handleMeta(meta) {
    return Location(meta.filename, meta.lineno);
}

export function handleType(type) {
    if (!type)
        return Void;
    if (type.names && type.names.length == 1) {
        return type.names[0];
    }
    else {
        return type.names;
    }
}
