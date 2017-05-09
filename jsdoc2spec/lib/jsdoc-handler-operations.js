import {handleMeta, handleType} from './jsdoc-handler-shared';
import {Operation, Void, JsDocError, Param} from 'swank-model';
import {dump} from './util';

const groupByName = (groups, func) => {
    if (!func)
        return groups;
    if (groups[func.name])
        groups[func.name].push(func);
    else
        groups[func.name] = [func];
    return groups;
};

const handleParam = (param) => {
    return Param(param.name,
        handleType(param.type),
        param.optional,
        param.defaultvalue,
        param.variable
    );
};

const processFunctions = (onError) => (funcs) => {
    if (funcs.length > 0) {
        let func = funcs[0];
        let params = (func.params || []).map(handleParam);

        if (func.returns && func.returns.length > 1)
            onError(JsDocError(`Operation ${func.name} has multiple returns annotations`, [handleMeta(func.meta)]));

        if (funcs.length > 1)
            onError(JsDocError(`Operation ${func.name} is defined two or more times`, funcs.map(func => handleMeta(func.meta))));

        let ret = (func.returns && func.returns.length > 0)? handleType(func.returns[0].type): Void;


        // todo handle name params
        return Operation(func.name, [], params, ret);
    }
};


export function handleFunctions(find, service, onError) {
    let functions = find({kind: 'function', memberof: service.longname});
    if (!functions)
        return [];

    let groups = functions.reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(processFunctions(onError));

}

export function handleCallbacks(find, service, onError) {
    let typedefs = find({kind: 'typedef', memberof: service.longname});
    if (!typedefs)
        return [];

    let callbacks = typedefs.filter((_) => _.type && _.type.names && _.type.names[0] === 'function');

    let groups = callbacks.reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(processFunctions(onError));

}
