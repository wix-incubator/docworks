import * as dom from 'dts-dom';

const builtInTypes = {
    'string': dom.type.string,
    'boolean': dom.type.boolean,
    'number': dom.type.number,
    'Object': dom.type.object,
    'void': dom.type.void,
    '*': dom.type.any
};

export function getDtsType(type) {
    if (typeof type === 'string') {
        if (builtInTypes[type])
            return builtInTypes[type];
        else
            return validDtsName(type);
    }
    else if (typeof type === 'object' && type.name) {
        if (type.name === 'Array') {
            return `[${getDtsType(type.typeParams[0])}]`;
        }
        else if (type.name === 'Promise') {
            return dom.create.namedTypeReference(`Promise<${getDtsType(type.typeParams[0])}>`)
        }
    }
    else if (Array.isArray(type) && type.length > 0) {
        return getDtsType(type[0]);
    }
}

export function validDtsName(name) {
    return name.replace(/[^\w$<>\.:!]/g, '_');
}

function trimPara(text) {
    if(text) {
        return text.trim().replace(/<(?:.|\n)*?>/gm, '');
    }
    return '';
}

function convertTreeToString(tree){
    return Object.keys(tree).map(key => dom.emit(tree[key])).join('');
}

function dtsMethod(name, params, returnType, {jsDocComment}){
    const method = dom.create.method(
        name,
        params.map(param => {
            const parameter = dom.create.parameter(param.name, getDtsType(param.type));
            parameter.jsDocComment = trimPara(param.doc);
            return parameter;
        }),
        getDtsType(returnType));
    method.jsDocComment = jsDocComment;
    return method;
}

function dtsFunction(name, params, returnType, {jsDocComment}){
    const func = dom.create.function(
        name,
        params.map(param => {
            const parameter = dom.create.parameter(param.name, getDtsType(param.type));
            parameter.jsDocComment = trimPara(param.doc);
            return parameter;
        }),
        getDtsType(returnType));
    func.jsDocComment = jsDocComment;
    return func;
}

function dtsConst(property){
    const cnt = dom.create.const(property.name, getDtsType(property.type));
    cnt.jsDocComment = trimPara(property.docs.summary);
    return cnt;
}

function dtsProperty(property){
    const prop = dom.create.property(property.name, getDtsType(property.type));
    prop.jsDocComment = trimPara(property.docs.summary);
    return prop;
}

function dtsModule(name, {members = [], jsDocComment}) {
    const module = dom.create.module(name);
    module.members = members;
    module.jsDocComment = jsDocComment;
    return module;
}

function dtsInterface(name, {members = [], baseTypes = [], jsDocComment}) {
    const intf = dom.create.interface(name);
    intf.members = members;
    intf.baseTypes = baseTypes;
    intf.jsDocComment = jsDocComment;
    return intf;
}

function dtsObjectType(members) {
    return dom.create.objectType(members.map(member => {
        const declarationFlags = member.optional ? dom.DeclarationFlags.Optional : dom.DeclarationFlags.None;
        const prop = dom.create.property(member.name, getDtsType(member.type), declarationFlags);
        prop.jsDocComment = trimPara(member.doc);
        return prop;
    }))
}

function dtsAlias(name, type, {jsDocComment}) {
    const alias = dom.create.alias(name, type);
    alias.jsDocComment = jsDocComment;
    return alias;
}

function dtsFunctionType(params, returnType) {
    return dom.create.functionType(params.map(param => {
            const parameter = dom.create.parameter(param.name, getDtsType(param.type));
            parameter.jsDocComment = trimPara(param.doc);
            return parameter;
        }),
        getDtsType(returnType));
}

function dtsNamespace(name) {
    return dom.create.namespace(validDtsName(name));
}

function convertServiceToInterface(service) {
    const properties = service.properties.map(dtsProperty);
    const operations = service.operations.map(convertOperationToMethod);
    const members = properties.concat(operations);
    const baseTypes = service.mixes.map(validDtsName);
    const jsDocComment = trimPara(service.docs.summary);
    return dtsInterface(service.name, {members, baseTypes, jsDocComment});
}

function convertServiceToModule(service) {
    const properties = service.properties.map(dtsConst);
    const operations = service.operations.map(convertOperationToFunction);
    const members = properties.concat(operations);
    const jsDocComment = trimPara(service.docs.summary);
    return dtsModule(service.name, {members, jsDocComment});
}

function convertOperationToMethod(operation) {
    const {name, params, ret, docs} = operation;
    const jsDocComment = trimPara(docs.summary);
    return dtsMethod(name, params, ret.type, {jsDocComment});
}

function convertOperationToFunction(operation) {
    const {name, params, ret, docs} = operation;
    const jsDocComment = trimPara(docs.summary);
    return dtsFunction(name, params, ret.type, {jsDocComment});
}

function convertMessageToType(message) {
    const objectType = dtsObjectType(message.members);
    const messageName = validDtsName(message.name);
    const type = dtsAlias(messageName, objectType, {jsDocComment: trimPara(message.docs.summary)});
    return type;
}

function convertCallbackToType(callback) {
    const functionType = dtsFunctionType(callback.params, callback.ret.type);
    const callbackName = validDtsName(callback.name);
    const type = dom.create.alias(callbackName, functionType);
    type.jsDocComment = trimPara(callback.docs.summary);
    return type;
}

function ensureNameSpace(namespaces, name) {
    let namespace = namespaces[name];
    if(!namespace){
        namespace = dtsNamespace(name);
        namespaces[name] = namespace;
    }
    return namespace;
}

export default function dts(services) {
    let namespaces = {};
    let modules = {};

    services.forEach(service => {
        const serviceName = service.name;
        const parentName = service.memberOf;
        if(!parentName){
            if(modules[serviceName]){
                return; //TODO: error handling
            }
            const module = convertServiceToModule(service);
            if(module.members.length > 0) {
                modules[serviceName] = module;
            }

            const messages = service.messages;
            const callbacks = service.callbacks;

            if (messages.length > 0 || callbacks.length > 0){
                const namespace = ensureNameSpace(namespaces, serviceName);

                messages.forEach(message => {
                    const type = convertMessageToType(message);
                    namespace.members.push(type);
                });

                callbacks.forEach(callback => {
                    const type = convertCallbackToType(callback);
                    namespace.members.push(type);
                });
            }
        } else {
            const namespace = ensureNameSpace(namespaces, parentName);

            const intf = convertServiceToInterface(service);
            namespace.members.push(intf);


            const messages = service.messages;
            const callbacks = service.callbacks;
            if (messages.length > 0 || callbacks.length > 0){
                const innerNamespace = dtsNamespace(serviceName);

                messages.forEach(message => {
                    const type = convertMessageToType(message);
                    innerNamespace.members.push(type);
                });

                callbacks.forEach(callback => {
                    const type = convertCallbackToType(callback);
                    innerNamespace.members.push(type);
                });

                namespace.members.push(innerNamespace);
            }
        }
    })

    return [convertTreeToString(modules), convertTreeToString(namespaces)].join('');
}