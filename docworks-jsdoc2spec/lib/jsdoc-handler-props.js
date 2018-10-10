import {Property, Void, JsDocError} from 'docworks-model';
import {handleMeta, handleType, typeContext, handleDoc} from './jsdoc-handler-shared';
import handlePlugins from './docworks-plugins';
import isEqual from 'lodash.isequal';
import {dump} from './util';


const extractMembers = (find, onError, plugins) => (member) => {
    // handle read property
    let location = handleMeta(member.meta);
    let context = typeContext('Property', member.name, '', member.memberof, location);
    let extra = handlePlugins(plugins, 'extendDocworksProperty', member);
    let defaultValue = member.defaultvalue;
    if (member.type)
        return Property(member.name, [], true, false, handleType(member.type, find, onError, context), defaultValue, [location], handleDoc(member, plugins), extra);

    // handle write property
    if (member.params && member.params.length > 0)
        return Property(member.name, [], false, true, handleType(member.params[0].type, find, onError, context), defaultValue, [location], handleDoc(member, plugins), extra);

    onError(JsDocError(`Property ${member.name} is missing a type annotation`, [location]));
    return Property(member.name, [], false, false, Void, defaultValue, [location], handleDoc(member, plugins), extra);

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

const mergeProperties = (service, onError) => (properties) => {
    let prop1 = properties[0];
    if (properties.length === 1) {
        if (prop1.set && !prop1.get)
            onError(JsDocError(
                `Property ${prop1.name} is a write only property`,
                prop1.locations));

        return prop1;
    }
    if (properties.length === 2) {

        let prop2 = properties[1];
        let extra = Object.assign({}, prop1.extra, prop2.extra);
        let locations = prop1.locations.concat(prop2.locations);
        if (isEqual(prop1.type, prop2.type) &&
            prop1.get !== prop2.get &&
            prop1.set !== prop2.set) {
            let docs = prop1.get?prop1.docs:prop2.docs;
            return Property(prop1.name, [], true, true, prop1.type, prop1.defaultValue, locations, docs, extra);
        }

        if (!isEqual(prop1.type, prop2.type) &&
            prop1.get !== prop2.get &&
            prop1.set !== prop2.set) {
            onError(JsDocError(
                `Property ${prop1.name} has mismatching types for get (${prop1.type}) and set (${prop2.type})`,
                locations));
            let docs = prop1.get?prop1.docs:prop2.docs;
            return Property(prop1.name, [], true, true, prop1.type, prop1.defaultValue, locations, docs, extra)
        }

        onError(JsDocError(
            `Property ${prop1.name} is defined two or more times`,
            locations));
        return Property(prop1.name, [], true, true, prop1.type, prop1.defaultValue, locations, prop1.docs, prop1.extra)

    }
    let locations = [].concat(...properties.map(_ => _.locations));
    onError(JsDocError(
        `Property ${prop1.name} is defined two or more times`,
        locations));
    return prop1;
};


export default function handleProperties(find, service, onError, plugins) {
    let members = find({kind: 'member', memberof: service.longname});
    if(!members)
        return [];


  members = members.filter(_ => !_.mixed);

  let groups = members.map(extractMembers(find, onError, plugins))
        .reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(mergeProperties(service, onError));
}

