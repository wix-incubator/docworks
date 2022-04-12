const SUB_SERVICES_KEY = 'services'
const $W_NAME = '$w'
const DATASET = {
	COMPONENT_NAME: 'dataset',
	MODULE_NAME: 'wixDataset',
	FROM: 'wix-dataset',
	MEMBER: 'Dataset'
}
const DYNAMIC_DATASET = Object.assign({}, DATASET, {
	COMPONENT_NAME: 'router_dataset',
	MEMBER: 'DynamicDataset'
})

const TYPES = {
	PROMISE: 'Promise',
	ARRAY: 'Array',
	RECORD: 'Record',
	MAP: 'Map'
}

const REMOVED_LABEL = 'removed'

module.exports = {
	TYPES,
	$W_NAME,
	SUB_SERVICES_KEY,
	DATASET,
	DYNAMIC_DATASET,
	REMOVED_LABEL
}
