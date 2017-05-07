import helper from 'jsdoc/util/templateHelper';
import {Service, Operation, Param, Property, Void} from 'swank-model';



//noinspection JSUnusedGlobalSymbols
export function publish(taffyData, opts) {
    opts.serviceModel.clear();

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);

    function find(spec) {
        return helper.find(data, spec);
    }

    opts.serviceModel.add(members.classes.map(handleService(find)));
}



function handleService(find) {
    return (service) => {
        let operations = handleFunctions(find, service);
        let properties = handleProperties(find, service);
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

function handleFunctions(find, service) {
    let functions = find({kind: 'function', memberof: service.longname});
    if (functions) {
        return functions.map((func) => {

            let params = func.params.map((param) => {
                return Param(param.name, handleType(param.type));
            });

            let ret = func.return? handleType(func.return.type): Void;

            // todo handle name params
            return Operation(func.name, [], params, ret);
        });
    }
}

function handleProperties(find, service) {
    let members = find({kind: 'member', memberof: service.longname});
    if(members) {
        return members.map((member) => {
            // todo read property get and set indicators
            return Property(member.name, true, true, handleType(member.type));
        });
    }
    else
        return [];
}

function handleType(type) {
    if (type.names.length == 1) {
        return type.names[0];
    }
    else {
        return type.names;
    }
}