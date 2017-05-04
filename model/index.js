

export function Service(name) {
    return {
        name: name,
        properties: [],
        messages: [],
        operations: []
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