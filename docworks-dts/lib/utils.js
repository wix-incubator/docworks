function validServiceName(name) {
    return name.replace(/[^\w$<>.:!]/g, '_')
}

module.exports = {
    validServiceName,
}