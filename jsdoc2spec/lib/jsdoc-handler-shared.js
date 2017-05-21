import {Void, Location, JsDocError} from 'swank-model';

export function handleMeta(meta) {
    return Location(meta.filename, meta.lineno);
}

const builtInTypes = {
    'string': 'string',
    'String': 'string',
    'boolean': 'boolean',
    'Boolean': 'boolean',
    'number': 'number',
    'Number': 'number',
    'Date': 'Date'
};

/**
 *
 * @param kind - member, operation, message
 * @param name - the name
 * @param part - param, return, empty
 * @param defaultScope - the default lookup scope for relative type references
 * @param location - Location obj
 * @returns {{kind: *, name: *, part: *, location: *}}
 */
export function typeContext(kind, name, part, defaultScope, location) {
    return {
        kind, name, part, defaultScope, location
    }
}

export function handleType(type, find, onError, context) {
    if (!type || !type.names)
        return Void;

    let typeNames = type.names;

    if (find) {
        typeNames = typeNames.map((name) => {
            let typeByFullPath = find({longname: name});
            let typeByRelativePath = find({name: name})
                .filter((aType) => aType.memberof === context.defaultScope);
            let builtInType = builtInTypes[name];

            if (typeByFullPath.length === 0 && typeByRelativePath.length === 0 && !builtInType) {
                let paddedPart = context.part + (context.part?" ":"");
                onError(JsDocError(`${context.kind} ${context.name} has an unknown ${paddedPart}type ${name}`, [context.location]));
            }
            if (typeByFullPath.length === 0 && typeByRelativePath.length === 1)
                return `${context.defaultScope}.${name}`;
            if (builtInType)
                return builtInType;
            return name;
        })
    }

    if (typeNames.length == 1) {
        return typeNames[0];
    }
    else {
        return typeNames;
    }
}
