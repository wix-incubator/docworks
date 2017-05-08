import helper from 'jsdoc/util/templateHelper';
import {Service, Operation, Param, Void, JsDocError, Location} from 'swank-model';
import handleProperties from './jsdoc-handler-props';
import {dump} from './util';



//noinspection JSUnusedGlobalSymbols
export function publish(taffyData, opts) {
    opts.serviceModel.clear();

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);

    function find(spec) {
        return helper.find(data, spec);
    }

    const onError = (jsDocError) => opts.serviceModel.addError(jsDocError);

    opts.serviceModel.add(members.classes.map(handleService(find, onError)));
}



function handleService(find, onError) {
    return (service) => {
        let operations = handleFunctions(find, service, onError);
        let properties = handleProperties(find, service, onError);
        handleMembers(find)(service, 'namespace');
        handleMembers(find)(service, 'typedef');
        return Service(service.name, properties, operations);
    }
}

function handleMembers(find) {
    return (service, kind) => {
        var members = find({kind: kind, memberof: service.longname});
        if(members) {
            members.forEach(function(mem) {
                console.log('member', mem.kind, mem.longname);
            });
        }
    }
}

function handleFunctions(find, service, onError) {
    let functions = find({kind: 'function', memberof: service.longname});
    if (functions) {
        return functions.map((func) => {

            let params = (func.params || []).map((param) => {
                return Param(param.name, handleType(param.type));
            });

            if (func.returns && func.returns.length > 1)
                onError(JsDocError(`Operation ${func.name} has multiple returns annotations`, [handleMeta(func.meta)]));

            let ret = (func.returns && func.returns.length > 0)? handleType(func.returns[0].type): Void;

            // todo handle name params
            return Operation(func.name, [], params, ret);
        });
    }
}

function handleMeta(meta) {
    return Location(meta.filename, meta.lineno);
}

function handleType(type) {
    if (!type)
        return Void;
    if (type.names && type.names.length == 1) {
        return type.names[0];
    }
    else {
        return type.names;
    }
}