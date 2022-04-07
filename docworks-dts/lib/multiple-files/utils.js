const { REMOVED_LABEL, SUB_SERVICES_KEY } = require('./constants')
 
const isIncludesRemovedLabel = ({labels} = {}) => labels && labels.length === 1 && labels[0] === REMOVED_LABEL
const isNotIncludesRemovedLabel = (item) => !isIncludesRemovedLabel(item)

const getServiceFilteredProperties = (service) =>{
	let {
		name,
		properties = [],
		operations = [],
		messages = [],
		callbacks = [],
		[SUB_SERVICES_KEY]: subServices = {}
	} = service

	properties = properties.filter(isNotIncludesRemovedLabel)
	operations = operations.filter(isNotIncludesRemovedLabel)
	messages = messages.filter(isNotIncludesRemovedLabel)
	callbacks = callbacks.filter(isNotIncludesRemovedLabel)
	return { name, properties, operations, messages, callbacks, subServices }
}

module.exports = { isIncludesRemovedLabel, isNotIncludesRemovedLabel, getServiceFilteredProperties }