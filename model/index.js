

export function Service(name, properties, operations, messages) {
    return {
        name: name,
        properties: properties,
        operations: operations,
        messages: messages
    }
}

export const Void = 'void';
export const Any = '*';

export function Operation(name, nameParams, params, ret) {
    return {
        name: name,
        nameParams: nameParams,
        params: params,
        ret: ret
    }
}

export function Param(name, type, optional, defaultValue, spread) {
    return {
        name: name,
        type: type,
        optional: optional,
        defaultValue: defaultValue,
        spread: spread
    }
}

export function Property(name, isGet, isSet, type, locations) {
    return {
        name: name,
        get: isGet,
        set: isSet,
        type: type,
        locations: locations
    }
}

export function AtomicType(name) {
    return name;
}

export function UnionType(names) {
    return names;
}

export function Location(filename, lineno) {
    return {
        filename: filename,
        lineno: lineno
    }
}

export function JsDocError(message, locations) {
    const groupByFile = (groups, location) => {
        if (groups[location.filename])
            groups[location.filename].push(location);
        else
            groups[location.filename] = [location];
        return groups;
    };

    let files = locations.reduce(groupByFile, {});
    let fileLocations = Object.keys(files)
        .map((group) => {
            let linenos = files[group].map(location => location.lineno);
            return `${group} (${linenos.join(", ")})`;
        })
        .join(", ");
    return {
        message: message,
        location: fileLocations
    }
}