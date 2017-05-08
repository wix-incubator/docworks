import helper from 'jsdoc/util/templateHelper';
import {Service, Operation, Param, Property, Void, JsDocError} from 'swank-model';
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

            let params = func.params.map((param) => {
                return Param(param.name, handleType(param.type));
            });

            let ret = func.return? handleType(func.return.type): Void;

            // todo handle name params
            return Operation(func.name, [], params, ret);
        });
    }
}

function handleProperties(find, service, onError) {
    let members = find({kind: 'member', memberof: service.longname});
    if(!members)
        return [];

    const extractMembers = (member) => {
        // handle read property
        if (member.type)
            return Property(member.name, true, false, handleType(member.type));

        // handle write property
        if (member.params && member.params.length > 0)
            return Property(member.name, false, true, handleType(member.params[0].type));

        onError(JsDocError(`Property ${member.name} is missing a type annotation`, metaToLocation(member.meta)));
        return Property(member.name, false, false, Void);

        // error multiple params
        // error type void

    };

    const groupByName = (groups, property) => {
        if (!property)
            return groups;
        if (groups[property.name])
            groups[property.name].push(property);
        else
            groups[property.name] = [property];
        return groups;
    };

    const mergeProperties = (properties) => {
        if (properties.length == 1)
            return properties[0];
        if (properties.length == 2) {
            if (properties[0].type === properties[1].type &&
                properties[0].get != properties[1].get &&
                properties[0].set != properties[1].set)
                return Property(properties[0].name, true, true, properties[0].type)
        }
        // error
        return properties[0];
    };

    let groups = members.map(extractMembers)
        .reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(mergeProperties);
}

function metaToLocation(meta) {
    return `${meta.filename} (${meta.lineno})`;
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