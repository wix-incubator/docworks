export function toJson(obj, indentSize, spec) {
    return serialize(obj, 0, indentSize, spec);
}

function serialize(obj, indentPos, indentSize, spec) {
    let indent = new Array((indentPos+1)*indentSize + 1).join(' ');
    let names = Object.getOwnPropertyNames(obj);
    let orderedNames = (spec || {}).order || [];
    let props = [];

    for (let i in orderedNames) {
        let name = orderedNames[i];
        if (obj[name]) {
            props.push(`${indent}${name}:` + JSON.stringify(obj[name]));
        }
    }

    for (let i in names) {
        let name = names[i];
        if (!orderedNames.find(_ => _ === name)) {
            props.push(`${indent}${name}:` + JSON.stringify(obj[name]));
        }
    }
    return '{\n' +
        props.join(',\n') +
        '\n}';
}