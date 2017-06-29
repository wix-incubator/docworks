import isArray from 'lodash.isarray';
import isObject from 'lodash.isobject';

export function toJson(obj, indentSize, spec) {
    let indent = new Array(indentSize + 1).join(' ');
    return serialize(obj, "", indent, spec);
}

export function fromJson(json, spec) {
    let obj = JSON.parse(json);
    return deserialize(obj, spec)
}

function serialize(obj, indent, indentStep, spec) {
    let indentChilds = indent + indentStep;
    let indentGrandChild = indentChilds + indentStep;
    let names = Object.getOwnPropertyNames(obj);
    let orderedNames = specToOrderedNames(spec);
    let props = [];

    function handleValue(name, value, valueSpec) {
        if (valueSpec && valueSpec.multiLine) {
            let lines = value.split('\n')
                .map(JSON.stringify)
                .map(line => `${indentGrandChild}${line}`)
                .join(",\n");

            props.push(`${indentChilds}"${name}": [\n${lines}\n${indentChilds}]`);
        }
        else if (isArray(value))
            throw new Error('TBD');// todo
        else if (isObject(value))
            props.push(`${indentChilds}"${name}": ` + serialize(value, indentChilds, indentStep, valueSpec));
        else
            props.push(`${indentChilds}"${name}": ` + JSON.stringify(value));
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

function deserialize(obj, spec) {
    spec = spec || [];
    let keys = Object.keys(obj);
    keys.forEach(key => {
        if (spec[key] && spec[key].multiLine && isArray(obj[key]))
            obj[key] = obj[key].join('\n');
        if (isObject(obj[key]) && spec[key])
            obj[key] = deserialize(obj[key], spec[key]);
    });
    return obj;
}