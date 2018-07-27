import {Void, Location, JsDocError, GeneticType, Docs, Example} from 'docworks-model';

export function handleMeta(meta) {
    return Location(meta.filename, meta.lineno);
}

const builtInTypes = {
    'string': 'string',
    'String': 'string',
    'boolean': 'boolean',
    'Boolean': 'boolean',
    'number': 'number',
    'Number': 'number',
    'Date': 'Date',
    'Array': 'Array',
    'Function': 'Function',
    'Promise': 'Promise',
    'Object': 'Object',
    'void': Void
};

/**
 *
 * @param kind - member, operation, message
 * @param name - the name
 * @param part - param, return, empty
 * @param defaultScope - the default lookup scope for relative type references
 * @param location - Location obj
 * @returns {{kind: *, name: *, part: *, location: *}}
 */
export function typeContext(kind, name, part, defaultScope, location) {
    return {
        kind, name, part, defaultScope, location
    }
}

function convertToTilde(longname) {
  let tokens = longname.split('.');
  let namespaces = tokens.slice(0, -1);
  let name = tokens.slice(-1);
  return `${namespaces.join('.')}~${name[0]}`;
}

const testGeneric = /([^,<>]+)\.<([^,]+)>$/;
export function handleType(type, find, onError, context) {
    if (!type || !type.names)
        return Void;

    let typeNames = type.names;

    let handleTypeName = (name) => {
        name = name.trim().replace('~', '.');
        let generic = testGeneric.exec(name);
        if (generic) {
            return GeneticType(handleTypeName(generic[1]),
                generic[2].split(',').map(handleTypeName)
            );
        }
        let typeByFullPath = find({longname: name});
        let typeByFullPathWithTilde = find({longname: convertToTilde(name)});
        let typeByRelativePath = find({name: name})
            .filter((aType) => aType.memberof === context.defaultScope);
        let builtInType = builtInTypes[name];

        if (typeByFullPath.length === 0 && typeByFullPathWithTilde.length === 0 && typeByRelativePath.length === 0 && !builtInType) {
            let paddedPart = context.part + (context.part?" ":"");
            onError(JsDocError(`${context.kind} ${context.name} has an unknown ${paddedPart}type ${name}`, [context.location]));
        }
        if (typeByFullPath.length === 0 && typeByRelativePath.length === 1)
            return `${context.defaultScope}.${name}`;
        if (builtInType)
            return builtInType;
        return name;
    };

    if (find) {
        typeNames = typeNames.map(handleTypeName)
    }

    if (typeNames.length == 1) {
        return typeNames[0];
    }
    else {
        return typeNames;
    }
}

const exampleCaption = /<caption>(.*)<\/caption>([\s\S]*)/;
export function handleDoc(doclet) {
    let rawExamples = doclet.examples || [];
    let examples = rawExamples.map((ex) => {
        let found;
        if (found = exampleCaption.exec(ex)) {
            return Example(found[1], found[2].trim())
        }
        else
            return Example(undefined, ex);
    });
    return Docs(doclet.summary, doclet.description, doclet.see?doclet.see:[], examples);
}
