

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

export function Param(name, type) {
    return {
        name: name,
        type: type
    }
}

export function Property(name, isGet, isSet, type) {
    return {
        name: name,
        get: isGet,
        set: isSet,
        type: type
    }
}

export function AtomicType(name) {
    return name;
}

export function UnionType(names) {
    return names;
}