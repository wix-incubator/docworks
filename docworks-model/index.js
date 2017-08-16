

export function Service(name, memberOf, mixes, properties, operations, callbacks, messages, location, docs, srcDocs) {
    return {
        name: name,
        memberOf: memberOf,
        mixes: mixes,
        properties: properties,
        operations: operations,
        callbacks: callbacks,
        messages: messages,
        location: location,
        docs: docs,
        srcDocs: srcDocs
    }
}

export const Void = 'void';
export const Any = '*';

export function Docs(summary, description, links, examples) {
    return {
        summary: summary,
        description: description,
        links: links,
        examples: examples
    }
}

export function Example(title, body) {
    return {
        title: title,
        body: body
    }
}

export function Operation(name, nameParams, params, ret, locations, docs, srcDocs) {
    return {
        name: name,
        nameParams: nameParams,
        params: params,
        ret: ret,
        locations: locations,
        docs: docs,
        srcDocs: srcDocs
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

export function Property(name, isGet, isSet, type, locations, docs, srcDocs) {
    return {
        name: name,
        get: isGet,
        set: isSet,
        type: type,
        locations: locations,
        docs: docs,
        srcDocs: srcDocs
    }
}

export function Message(name, members, locations, docs, srcDocs) {
    return {
        name: name,
        members: members,
        locations: locations,
        docs: docs,
        srcDocs: srcDocs
    }
}

export function MessageMember(name, type) {
    return {
        name: name,
        type: type
    }
}

export function AtomicType(name) {
    return name;
}

export function UnionType(names) {
    return names;
}

export function GeneticType(name, typeParams) {
    return {
        name: name,
        typeParams: typeParams
    };
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