import {handleMeta, handleType, typeContext, handleDoc} from './jsdoc-handler-shared';
import {Operation, Void, JsDocError, Param, Return} from 'docworks-model';
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

const handleParam = (find, onError, context) => (param) => {
    if (param.name && !param.type)
        onError(JsDocError(`${context.kind} ${context.name} param ${param.name} has a name but no type. Did you forget the {} around the type?`, [context.location]));
    return Param(param.name,
        handleType(param.type, find, onError, context),
        param.description,
        param.description,
        param.optional,
        param.defaultvalue,
        param.variable
    );
};

const processFunctions = (find, onError, kind) => (funcs) => {
    if (funcs.length > 0) {
        let func = funcs[0];
        let params = (func.params || [])
            .map(handleParam(find, onError, typeContext(kind, func.name, 'param', func.memberof, handleMeta(func.meta))));

        if (funcs.length > 1)
            onError(JsDocError(`${kind} ${func.name} is defined two or more times`, funcs.map(func => handleMeta(func.meta))));


        let ret = Return(Void, undefined, undefined);
        if (func.returns && func.returns.length > 0) {
            if (func.returns.length > 1)
                onError(JsDocError(`${kind} ${func.name} has multiple returns annotations`, [handleMeta(func.meta)]));

            if (func.returns[0].description && !func.returns[0].type)
                onError(JsDocError(`${kind} ${func.name} has return description but no type. Did you forget the {} around the type?`, [handleMeta(func.meta)]));

            ret =
              Return(handleType(func.returns[0].type, find, onError, typeContext(kind, func.name, 'return', func.memberof, handleMeta(func.meta))),
                func.returns[0].description,
                func.returns[0].description);
        }

        // todo handle name params
        return Operation(func.name, [], [], params, ret, funcs.map(func => handleMeta(func.meta)), handleDoc(func), handleDoc(func));
    }
};


export function handleFunctions(find, service, onError) {
    let functions = find({kind: 'function', memberof: service.longname});
    if (!functions)
        return [];

    let groups = functions.reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(processFunctions(find, onError, 'Operation'));

}

export function handleCallbacks(find, service, onError) {
    let typedefs = find({kind: 'typedef', memberof: service.longname});
    if (!typedefs)
        return [];

    let callbacks = typedefs.filter((_) => _.type && _.type.names && _.type.names[0] === 'function');

    let groups = callbacks.reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(processFunctions(find, onError, 'Callback'));

}
