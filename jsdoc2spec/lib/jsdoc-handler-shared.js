import {Void, Location, JsDocError} from 'swank-model';

export function handleMeta(meta) {
    return Location(meta.filename, meta.lineno);
}

/**
 *
 * @param kind - member, operation, message
 * @param name - the name
 * @param part - param, return, empty
 * @param location - Location obj
 * @returns {{kind: *, name: *, part: *, location: *}}
 */
export function typeContext(kind, name, part, location) {
    return {
        kind, name, part, location
    }
}

export function handleType(type, find, onError, context) {
    if (!type)
        return Void;

    if (type.names && find) {
        type.names.forEach((name) => {
            if (find({longname: name}).length === 0)
                onError(JsDocError(`${context.kind} ${context.name} has an unknown ${context.part} type ${name}`, [context.location]));
        })
    }

    if (type.names && type.names.length == 1) {
        return type.names[0];
    }
    else {
        return type.names;
    }
}
