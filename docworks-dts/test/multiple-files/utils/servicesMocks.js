const { validProp, validFunc, validMessage } = require('./validItems')

const DETACHED_SERVICE_JSON = {
	name: 'Test',
	memberOf: 'wix-unknown-module',
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
		validProp,
		{
			name: 'test',
			labels: ['removed']
		}
	],
	operations: [
		{
			name: 'test',
			labels: ['removed']
		},
		validFunc
	],
	callbacks: [
		{
			name: 'test',
			labels: ['removed']
		},
		validFunc
	],
	messages: [
		{
			name: 'test',
			labels: ['removed']
		},
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

module.exports = {
	DETACHED_SERVICE_JSON,
	EMPTY_SERVICE_JSON,
	SERVICE_JSON_WITH_REMOVED_ITEMS,
	REMOVED_SERVICE_JSON
}