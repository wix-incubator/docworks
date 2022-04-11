const { EXTRA_PROPS_VALUES } = require('./new-type-strcture-test-service')

const validProp = {
	name: 'validProp',
	type: [{nativeType: 'boolean'}],
	...EXTRA_PROPS_VALUES
}

const validFunc = { 
    name: 'validFunc',
    labels: [],
    nameParams: [],
    params:
        [ { 'name': 'param',
            'type': 'number'} ],
    ret:
        { 'type': 'void'},
    ...EXTRA_PROPS_VALUES 
}

const validMessage = {
    name: 'validMessage',
    members:
        [ { 'name': 'code',
            'type': 'string',
            'doc': 'Error code.' }],
    ...EXTRA_PROPS_VALUES

}

module.exports = {
    validProp,
    validFunc,
    validMessage
}