
import {Property, Void, JsDocError} from 'docworks-model';
import {handleMeta, handleType, typeContext, handleDoc} from './jsdoc-handler-shared';


const extractMembers = (find, onError) => (member) => {
    // handle read property
    var location = handleMeta(member.meta);
    let context = typeContext('Property', member.name, '', member.memberof, location);
    if (member.type)
        return Property(member.name, true, false, handleType(member.type, find, onError, context), [location], handleDoc(member), handleDoc(member));

    // handle write property
    if (member.params && member.params.length > 0)
        return Property(member.name, false, true, handleType(member.params[0].type, find, onError, context), [location], handleDoc(member), handleDoc(member));

    onError(JsDocError(`Property ${member.name} is missing a type annotation`, [location]));
    return Property(member.name, false, false, Void, [location], handleDoc(member), handleDoc(member));

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

const mergeProperties = (onError) => (properties) => {
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
            let docs = prop1.get?prop1.docs:prop2.docs;
            return Property(prop1.name, true, true, prop1.type, locations, docs, docs);
        }

        if (prop1.type !== prop2.type &&
            prop1.get != prop2.get &&
            prop1.set != prop2.set) {
            onError(JsDocError(
                `Property ${prop1.name} has mismatching types for get (${prop1.type}) and set (${prop2.type})`,
                locations));
            let docs = prop1.get?prop1.docs:prop2.docs;
            return Property(prop1.name, true, true, prop1.type, locations, docs)
        }

        onError(JsDocError(
            `Property ${prop1.name} is defined two or more times`,
            locations));
        return Property(prop1.name, true, true, prop1.type, locations, prop1.docs, prop1.docs)

    }
    // error
    onError(JsDocError(
        `Property ${prop1.name} is defined two or more times`,
        locations));
    return prop1;
};


export default function handleProperties(find, service, onError) {
    let members = find({kind: 'member', memberof: service.longname});
    if(!members)
        return [];


    let groups = members.map(extractMembers(find, onError))
        .reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(mergeProperties(onError));
}

