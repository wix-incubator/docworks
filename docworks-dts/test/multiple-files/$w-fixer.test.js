const path = require('path')
const multifilesMain = require('../../lib/multiple-files')
const summaryTemplate =
	'<%= model.summary %>\n\t[Read more..](https://fake-corvid-api/<%= model.service %>.html#<%= model.member %>)'

const getServiceJson = servicePath =>
	require(path.join('../services/', servicePath))
const run = paths => {
	const services = paths.map(getServiceJson)
	return multifilesMain(services, { summaryTemplate, run$wFixer: true })
}
describe('convert docworks to dts with $w plugin', () => {
	describe('main declaration file content', () => {
		test('should not include $w module declaration', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json'
			])

			const unexpectedDeceleration = 'declare module \'$w\' {'

			expect(content).not.toContain(unexpectedDeceleration)
		})

		test('should include dataset alias declaration', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json',
				'wix-data.service.json',
				'wix-dataset.service.json'
			])
			const expectedDeceleration = 'type dataset = wixDataset.Dataset;'

			expect(content).toContain(expectedDeceleration)
		})

		test('should include router_dataset alias declaration', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json',
				'wix-data.service.json',
				'wix-dataset.service.json'
			])
			const expectedDeceleration =
				'type router_dataset = wixDataset.DynamicDataset;'

			expect(content).toContain(expectedDeceleration)
		})

		test('should include $w service callbacks declaration', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json',
				'wix-data.service.json',
				'wix-dataset.service.json'
			])
			const expectedDeceleration =
				'type GoogleMapClickEvent = (event: GoogleMapClickEvent)=>void;'

			expect(content).toContain(expectedDeceleration)
		})
	})
})
