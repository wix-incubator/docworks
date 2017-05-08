import helper from 'jsdoc/util/templateHelper';
import {Service, Operation, Param, Property, Void, JsDocError, Location} from 'swank-model';
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
            return Property(member.name, true, false, handleType(member.type), [handleMeta(member.meta)]);

        // handle write property
        if (member.params && member.params.length > 0)
            return Property(member.name, false, true, handleType(member.params[0].type), [handleMeta(member.meta)]);

        onError(JsDocError(`Property ${member.name} is missing a type annotation`, [handleMeta(member.meta)]));
        return Property(member.name, false, false, Void, [handleMeta(member.meta)]);

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
        let prop1 = properties[0];
        if (properties.length == 1) {
            if (prop1.set && !prop1.get)
                onError(JsDocError(
                    `Property ${prop1.name} is a write only property`,
                    prop1.locations));

            return prop1;
        }
        if (properties.length == 2) {

            var prop2 = properties[1];
            var locations = prop1.locations.concat(prop2.locations);
            if (prop1.type === prop2.type &&
                prop1.get != prop2.get &&
                prop1.set != prop2.set) {
                return Property(prop1.name, true, true, prop1.type, locations);
            }

            if (prop1.type !== prop2.type &&
                prop1.get != prop2.get &&
                prop1.set != prop2.set) {
                onError(JsDocError(
                    `Property ${prop1.name} has mismatching types for get (${prop1.type}) and set (${prop2.type})`,
                    locations));
                return Property(prop1.name, true, true, prop1.type, locations)
            }

            onError(JsDocError(
                `Property ${prop1.name} is defined two or more times`,
                locations));
            return Property(prop1.name, true, true, prop1.type, locations)

        }
        // error
        return prop1;
    };

    let groups = members.map(extractMembers)
        .reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(mergeProperties);
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