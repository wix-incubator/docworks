const { REMOVED_LABEL } = require('../../../lib/multiple-files/constants')
const { validProp, validFunc, validMessage } = require('./validItems')

const getRemovedItem = (extraLabels = []) =>({
	name: 'test',
	labels: ['removed', ...extraLabels]
})

const aService = ({name, memberOf, properties, labels, operations} = {}) => ({
	name: name || 'Test',
	memberOf,
	mixes: [],
	labels: labels || [],
	docs: {
		summary: '',
		description: [],
		links: [],
		examples: [],
		request: 'NA'
	},
	properties: properties || [],
	operations: operations || [],
	callbacks: [],
	messages: [],
	clientId: 'test'
})

const DETACHED_SERVICE_JSON = aService({name:'Test', memberOf:'wix-unknown-module'})

const EMPTY_SERVICE_JSON = {
	name: 'Test',
	mixes: [],
	labels: [],
	docs: {
		summary: '',
		description: [],
		links: [],
		examples: [],
		request: 'NA'
	},
	properties: [],
	operations: [],
	callbacks: [],
	messages: [],
	clientId: 'test'
}

const SERVICE_JSON_WITH_REMOVED_ITEMS = {
	name: 'Test',
	mixes: [],
	labels: [],
	docs: {
		summary: '',
		description: [],
		links: [],
		examples: [],
		request: 'NA'
	},
	properties: [
		getRemovedItem(),
		getRemovedItem(['changed']),
		validProp,
	],
	operations: [
		getRemovedItem(),
		getRemovedItem(['changed']),
		validFunc
	],
	callbacks: [
		getRemovedItem(),
		getRemovedItem(['changed']),
		validFunc
	],
	messages: [
		getRemovedItem(),
		getRemovedItem(['changed']),
		validMessage
	],
	clientId: 'test'
}

const REMOVED_SERVICE_JSON = {
	name: 'Test',
	mixes: [],
	labels: ['removed'],
	docs: {
		summary: '',
		description: [],
		links: [],
		examples: [],
		request: 'NA'
	},
	properties: [validProp],
	operations: [],
	callbacks: [],
	messages: [],
	clientId: 'test'
}

const SERVICE_AND_REMOVED_SUB_SERVICE = {
	service: aService({name:'Test', operations: [validFunc]}),
	removedSubService: aService({name:'Test2', memberOf:'Test', properties:[validProp], labels:[REMOVED_LABEL]})
}

module.exports = {
	DETACHED_SERVICE_JSON,
	EMPTY_SERVICE_JSON,
	SERVICE_JSON_WITH_REMOVED_ITEMS,
	REMOVED_SERVICE_JSON,
	SERVICE_AND_REMOVED_SUB_SERVICE
}