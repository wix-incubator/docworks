const {validServiceName} = require('./utils')
const {
    convertTreeToString,
    dtsAlias,
    dtsConst,
    dtsFunction,
    dtsFunctionType,
    dtsInterface,
    dtsMethod,
    dtsModule,
    dtsNamespace,
    dtsProperty,
    dtsObjectType
} = require('./dts-generator')

function convertCallbackToType(callback) {
    const functionType = dtsFunctionType(callback.params, callback.ret.type)
    const callbackName = validServiceName(callback.name)
    return dtsAlias(callbackName, functionType, {jsDocComment: callback.docs.summary})
}

function convertServiceToInterface(service) {
    const properties = service.properties.map(dtsProperty)
    const operations = service.operations.map(convertOperationToMethod)
    const members = properties.concat(operations)
    const baseTypes = service.mixes.map(validServiceName)
    const jsDocComment = service.docs.summary
    return dtsInterface(service.name, {members, baseTypes, jsDocComment})
}

function convertServiceToModule(service) {
    const properties = service.properties.map(dtsConst)
    const operations = service.operations.map(convertOperationToFunction)
    const members = properties.concat(operations)
    const jsDocComment = service.docs.summary
    return dtsModule(service.name, {members, jsDocComment})
}

function convertOperationToMethod(operation) {
    const {name, params, ret, docs} = operation
    const jsDocComment = docs.summary
    return dtsMethod(name, params, ret.type, {jsDocComment})
}

function convertOperationToFunction(operation) {
    const {name, params, ret, docs} = operation
    const jsDocComment = docs.summary
    return dtsFunction(name, params, ret.type, {jsDocComment})
}

function convertMessageToType(message) {
    const objectType = dtsObjectType(message.members)
    const messageName = validServiceName(message.name)
    const jsDocComment = message.docs.summary
    return dtsAlias(messageName, objectType, {jsDocComment})
}

function ensureNamespace(namespaces, name) {
    let namespace = namespaces[name]
    if(!namespace){
        namespace = dtsNamespace(name)
        namespaces[name] = namespace
    }
    return namespace
}

function handleServiceAsModule(service, modules, namespaces){
    const serviceName = service.name

    if(modules[serviceName]){
        throw new Error(`Module ${serviceName} already defined`)
    }
    const module = convertServiceToModule(service)
    if(module.members.length > 0) {
        modules[serviceName] = module
    }

    const messages = service.messages
    const callbacks = service.callbacks

    if (messages.length > 0 || callbacks.length > 0){
        const namespace = ensureNamespace(namespaces, serviceName)

        messages.forEach(message => {
            const type = convertMessageToType(message)
            namespace.members.push(type)
        })

        callbacks.forEach(callback => {
            const type = convertCallbackToType(callback)
            namespace.members.push(type)
        })
    }
}

function handleServiceAsNamespace(service, namespaces){
    const serviceName = service.name

    const namespace = ensureNamespace(namespaces, service.memberOf)

    const intf = convertServiceToInterface(service)
    namespace.members.push(intf)

    const messages = service.messages
    const callbacks = service.callbacks
    if (messages.length > 0 || callbacks.length > 0){
        const innerNamespace = dtsNamespace(serviceName)

        messages.forEach(message => {
            const type = convertMessageToType(message)
            innerNamespace.members.push(type)
        })

        callbacks.forEach(callback => {
            const type = convertCallbackToType(callback)
            innerNamespace.members.push(type)
        })

        namespace.members.push(innerNamespace)
    }
}

function dts(services) {
    let namespaces = {}
    let modules = {}

    services.forEach(service => {
        if(!service.memberOf){
            handleServiceAsModule(service, modules, namespaces)
        } else {
            handleServiceAsNamespace(service, namespaces)
        }
    })

    return [convertTreeToString(modules), convertTreeToString(namespaces)].join('')
}

module.exports = dts