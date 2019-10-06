const {readFromDir} = require('docworks-repo')
const docworksToDts = require('../lib/dts-repo')

describe('convert docworks to dts with $w plugin', () => {

  function get$wDts(servicePath) {
    const services = [require('./services/$w.service.json')]
    if (servicePath) {
      services.push(require(servicePath))
    }

    return docworksToDts(services, {run$wFixer: true}).fixerDeclaration['$w']
  }

  function getMainDeclarationDts() {
    const services = [require('./services/$w.service.json')]

    return docworksToDts(services, {run$wFixer: true}).mainDeclaration
  }

  describe('main declaration file content', () => {
    test('should not include $w module declaration', () => {
      const dts = getMainDeclarationDts()
      const unexpectedDeceleration = 'declare module \'$w\' {'

      expect(dts).not.toContain(unexpectedDeceleration)
    })

    test('should include dataset alias declaration', () => {
      const dts = getMainDeclarationDts()
      const expectedDeceleration = 'type dataset = wix_dataset.Dataset;'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should include router_dataset alias declaration', () => {
      const dts = getMainDeclarationDts()
      const expectedDeceleration = 'type router_dataset = wix_dataset.DynamicDataset;'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should include $w service callbacks declaration', () => {
      const dts = getMainDeclarationDts()
      const expectedDeceleration = 'type GoogleMapClickEvent = (event: $w.GoogleMapClickEvent)=>void;'

      expect(dts).toContain(expectedDeceleration)
    })
  })

  describe('$w file content', () => {
    describe('IntersectionArrayAndBase', () => {
      test('should generate type declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'IntersectionArrayAndBase<T, P> = {[K in keyof T]: K extends P ? T[K] : T[K] & T[K][];}'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('TypeNameToSdkType', () => {
      test('should generate type declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'declare type TypeNameToSdkType = {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should include queryable services declaration', () => {
        const dts = get$wDts('./services/Gallery.service.json')
        const expectedDeceleration = 'Gallery: $w.Gallery;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should not include unqueryable services declaration', () => {
        const dts = get$wDts('./services/CartIcon.service.json')
        const unexpectedDeceleration = 'CartIcon: $w.CartIcon;'

        expect(dts).not.toContain(unexpectedDeceleration)
      })
    })

    describe('WixElementSelector', () => {
      test('should generate WixElementSelector type', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'type WixElementSelector = PageElementsMap & IntersectionArrayAndBase<TypeNameToSdkType, \'Document\'>'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('$w function declaration', () => {
      test('should generate $w function declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'declare function $w<T extends keyof WixElementSelector>(selector: T): WixElementSelector[T]'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('$w namespace declaration', () => {
      test('should generate $w namespace declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'declare namespace $w {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should generate at function declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'function at(context: $w.Event.EventContext): $w.$w;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should generate onReady function declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'function onReady(initFunction: $w.ReadyHandler): void;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should generate $w function type declaration', () => {
        const dts = get$wDts()
        const expectedDeceleration = 'type $w = <T extends keyof WixElementSelector>(selector: T)=>WixElementSelector[T]'

        expect(dts).toContain(expectedDeceleration)
      })
    })
  })

  describe('a repo', () => {
    test('should delete $w module and add dataset aliases', async () => {
      let repo = await readFromDir('./test/services')

      let dts = docworksToDts(repo.services, {run$wFixer: true})

      expect(dts.mainDeclaration).toMatchSnapshot()
    })

    test('should generate $w definition content', async () => {
      let repo = await readFromDir('./test/services')

      let dts = docworksToDts(repo.services, {run$wFixer: true})

      expect(dts.fixerDeclaration['$w']).toMatchSnapshot()
    })
  })
})
