const {readFromDir} = require('docworks-repo')
const docworksToDts = require('../lib/dts-repo')

describe('convert docworks to dts with $w plugin', () => {

  function get$wNamespaceDeclaration() {
    const services = [require('./services/$w.service.json')]

    return docworksToDts(services, {run$wFixer: true})
  }

  describe('main declaration file content', () => {
    test('should not include $w module declaration', () => {
      const dts = get$wNamespaceDeclaration()
      const unexpectedDeceleration = 'declare module \'$w\' {'

      expect(dts).not.toContain(unexpectedDeceleration)
    })

    test('should include dataset alias declaration', () => {
      const dts = get$wNamespaceDeclaration()
      const expectedDeceleration = 'type dataset = wix_dataset.Dataset;'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should include router_dataset alias declaration', () => {
      const dts = get$wNamespaceDeclaration()
      const expectedDeceleration = 'type router_dataset = wix_dataset.DynamicDataset;'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should include $w service callbacks declaration', () => {
      const dts = get$wNamespaceDeclaration()
      const expectedDeceleration = 'type GoogleMapClickEvent = (event: $w.GoogleMapClickEvent)=>void;'

      expect(dts).toContain(expectedDeceleration)
    })
  })

  describe('a repo', () => {
    test('should delete $w module and add dataset aliases', async () => {
      let repo = await readFromDir('./test/services')

      let dts = docworksToDts(repo.services, {run$wFixer: true})

      expect(dts).toMatchSnapshot()
    })
  })
})
