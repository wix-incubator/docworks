function validServiceName(name) {
    return name.replace(/[^\w$<[\]>.:!]/g, '_')
}

function createReferenceTypesMap(services) {
    // To support Service object Type property definition 
    // creating a messages types map from the service path according to {edm-name}.{service-name}.{message-name}
    return services.reduce((acc, curr) => {
        curr.messages.forEach(message => {
        acc[
            `${curr.memberOf ? `${curr.memberOf}.` : ''}${curr.name}.${
            message.name
            }`
        ] = {
            nativeType: message.name,
            typeParams: message.members.map(member => member.type)
        }
        })
        return acc
    }, {})
}

module.exports = {
    validServiceName,
    createReferenceTypesMap
}
