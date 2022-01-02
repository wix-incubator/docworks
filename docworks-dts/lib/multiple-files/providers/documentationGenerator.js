const template_ = require('lodash/template')
let documentationGenerator_ = null

const createDocumentationGenerator = summaryTemplate => item => {
	if (summaryTemplate) {
		return template_(summaryTemplate)({ model: item })
	}
	return item.summary
}

const set = summaryTemplate =>
	(documentationGenerator_ = createDocumentationGenerator(summaryTemplate))

module.exports = () => documentationGenerator_
module.exports.set = set
