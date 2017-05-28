import isArray from 'lodash.isarray';
import isObject from 'lodash.isobject';

export function toJson(obj, indentSize, spec) {
    return serialize(obj, 0, indentSize, spec);
}

function serialize(obj, indentPos, indentSize, spec) {
    let indent = new Array((indentPos)*indentSize + 1).join(' ');
    let indentChilds = new Array((indentPos+1)*indentSize + 1).join(' ');
    let names = Object.getOwnPropertyNames(obj);
    let orderedNames = specToOrderedNames(spec);
    let props = [];

    function handleValue(name, value, valueSpec) {
        if (isArray(value))
            ;
        else if (isObject(value))
            props.push(`${indentChilds}${name}:` + serialize(value, indentPos+1, indentSize, valueSpec));
        else
            props.push(`${indentChilds}${name}:` + JSON.stringify(value));
    }

    for (let i in orderedNames) {
        let name = orderedNames[i];
        if (obj[name]) {
            handleValue(name, obj[name], spec[name]);
        }
    }

    for (let i in names) {
        let name = names[i];
        if (!orderedNames.find(_ => _ === name)) {
            handleValue(name, obj[name]);
        }
    }
    return '{\n' +
        props.join(',\n') +
        `\n${indent}}`;
}

function specToOrderedNames(spec){
    spec = spec || [];
    let keys = Object.keys(spec);
    return keys.map(key => {
        let value = spec[key];
        if (value && value.pos)
            return [key, value.pos];
        else
            return undefined;
    })
        .filter(_ => !!_)
        .sort((a,b) => a[0] - b[0])
        .map(_ => _[0])
}