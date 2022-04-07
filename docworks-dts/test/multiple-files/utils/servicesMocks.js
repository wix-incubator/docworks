const { EXTRA_PROPS_VALUES } = require('./new-type-strcture-test-service')

const validProp = {
	name: 'validProp',
	type: [{nativeType: 'boolean'}],
	...EXTRA_PROPS_VALUES
}

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
		}
	],
	callbacks: [
		{
			name: 'test',
			labels: ['removed']
		}
	],
	messages: [
		{
			name: 'test',
			labels: ['removed']
		}
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