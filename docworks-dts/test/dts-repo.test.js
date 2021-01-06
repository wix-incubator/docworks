const { readFromDir } = require('docworks-repo')
const docworksToDts = require('../lib/dts-repo')
const summaryTemplate = '<%= model.summary %>\n\t[Read more..](https://fake-corvid-api/<%= model.service %>.html#<%= model.member %>)'

describe('convert docworks to dts', () => {
  function getDtsForServiceByPath(servicePath) {
    const service = require(servicePath)
    return docworksToDts([service], { summaryTemplate })
  }

  describe('documentation links', () => {
    test('should generate documentation link to modules', () => {
      const dts = getDtsForServiceByPath('./services/wix-users.service.json')
      const expectedDocLink = '[Read more..](https://fake-corvid-api/wix-users.html#)'
      expect(dts).toContain(expectedDocLink)
    })

    test('should generate documentation link to interfaces', () => {
      const dts = getDtsForServiceByPath('./services/ClickableMixin.service.json')
      const expectedDocLink = '[Read more..](https://fake-corvid-api/$w.ClickableMixin.html#)'
      expect(dts).toContain(expectedDocLink)
    })

    test('should generate documentation link to consts', () => {
      const dts = getDtsForServiceByPath('./services/wix-storage.service.json')
      const expectedDocLink = '[Read more..](https://fake-corvid-api/wix-storage.html#local)'
      expect(dts).toContain(expectedDocLink)
    })

    test('should generate documentation link to properties', () => {
      const dts = getDtsForServiceByPath('./services/Gallery.service.json')
      const expectedDocLink = '[Read more..](https://fake-corvid-api/$w.Gallery.html#currentIndex)'
      expect(dts).toContain(expectedDocLink)
    })

    test('should generate documentation link to methods', () => {
      const dts = getDtsForServiceByPath('./services/ClickableMixin.service.json')
      const expectedDocLink = '[Read more..](https://fake-corvid-api/$w.ClickableMixin.html#onClick)'
      expect(dts).toContain(expectedDocLink)
    })
  })

  describe('services', () => {
    test('should convert service to module if it is the root(does not have memberOf value)', () => {
      const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
      const expectedDeceleration = 'declare module \'wix-crm\' {'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should convert service to interface if it is not the root(has memberOf value)', () => {
      const dts = getDtsForServiceByPath('./services/StyleMixin.service.json')
      const expectedDeceleration = 'interface StyleMixin {'

      expect(dts).toContain(expectedDeceleration)
    })

    test('should convert service parent(memberOf) to a namespace', () => {
      const dts = getDtsForServiceByPath('./services/StyleMixin.service.json')
      const expectedDeceleration = 'declare namespace $w {'

      expect(dts).toContain(expectedDeceleration)
    })
  })

  describe('properties', () => {
    describe('module', () => {
      test('should convert to const', () => {
        const dts = getDtsForServiceByPath('./services/wix-users.service.json')
        const expectedDeceleration = 'const currentUser: wix_users.User;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should union types', () => {
        const dts = getDtsForServiceByPath('./services/wix-site.service.json')
        const expectedDeceleration =
          'const currentPage: wix_site.StructurePage | wix_site.StructureLightbox;'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('namespace', () => {
      test('should convert to read-only property', () => {
        const dts = getDtsForServiceByPath(
          './services/StyleMixin.service.json'
        )
        const expectedDeceleration = 'readonly style: $w.Style;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to read-write property', () => {
        const dts = getDtsForServiceByPath('./services/RequiredMixin.service')
        const expectedDeceleration = 'required: boolean;'
        const unexpectedDeceleration = 'readonly required: boolean;'

        expect(dts).toContain(expectedDeceleration)
        expect(dts).not.toContain(unexpectedDeceleration)
      })

      test('should convert to property with union type', () => {
        const dts = getDtsForServiceByPath('./services/Gallery.service.json')
        const expectedDeceleration =
          'readonly currentItem: $w.Gallery.ImageItem | $w.Gallery.VideoItem;'

        expect(dts).toContain(expectedDeceleration)
      })
    })
  })

  describe('operations', () => {
    describe('module', () => {
      test('should convert to function', () => {
        const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
        const expectedDeceleration =
          'function createContact(contactInfo: wix_crm.ContactInfo): Promise<string>;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to function with optional arguments', () => {
        const dts = getDtsForServiceByPath('./services/wix-users.service.json')
        const expectedDeceleration =
          'function emailUser(emailId: string, toUser: string, options?: wix_users.TriggeredEmailOptions): Promise<void>;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to function with union type as parameter', () => {
        const dts = getDtsForServiceByPath(
          './services/wix-router.service.json'
        )
        const expectedDeceleration =
          'function ok(Page: string | string[], routerReturnedData?: any, head?: wix_router.WixRouterResponse.HeadOptions): Promise<wix_router.WixRouterResponse>;'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('namespace', () => {
      test('should convert to method', () => {
        const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
        const expectedDeceleration =
          'addProductsToCart(products: $w.CartIcon.AddToCartItem[]): Promise<void>;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to method with optional parameter', () => {
        const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
        const expectedDeceleration =
          'addToCart(productID: string, quantity?: number, options?: $w.CartIcon.AddToCartOptions): Promise<void>;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to method union type parameters', () => {
        const dts = getDtsForServiceByPath(
          './services/HtmlComponent.service.json'
        )
        const expectedDeceleration =
          'postMessage(message: string | number | boolean | any | Array): void;'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to method with rest type as parameter', () => {
        const dts = getDtsForServiceByPath(
          './services/WixDataAggregate.service.json'
        )
        const expectedDeceleration =
          'ascending(...propertyName: string[]): wix_data.WixDataAggregate;'

        expect(dts).toContain(expectedDeceleration)
      })
    })
  })

  describe('messages', () => {
    describe('module', () => {
      test('should declare namespace with the same service name', () => {
        const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
        const expectedDeceleration = 'declare namespace wix_crm {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to type', () => {
        const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
        const expectedDeceleration = 'type ContactInfo = {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert all type\'s members to properties', () => {
        const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
        const expectedDecelerations = [
          'firstName: string;',
          'lastName: string;',
          'picture: string;',
          'emails: string[];',
          'loginEmail: string;',
          'phones: string[];',
          'labels: string[];',
          'language: string;',
          'customFields: string | number | Date;'
        ]

        expectedDecelerations.forEach(expectedDeceleration =>
          expect(dts).toContain(expectedDeceleration)
        )
      })
    })

    describe('namespace', () => {
      test('should declare inner namespace with the same service name', () => {
        const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
        const expectedOuterDeceleration = 'declare namespace $w {'
        const expectedInnerDeceleration = 'namespace CartIcon {'
        const unexpectedOuterDeceleration = 'declare namespace CartIcon {'

        expect(dts).toContain(expectedOuterDeceleration)
        expect(dts).toContain(expectedInnerDeceleration)
        expect(dts).not.toContain(unexpectedOuterDeceleration)
      })

      test('should convert to type', () => {
        const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
        const expectedDeceleration = 'type AddToCartItem = {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert all type\'s members to properties', () => {
        const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
        const expectedDecelerations = [
          'productID: string;',
          'options?: $w.CartIcon.AddToCartOptions;'
        ]

        expectedDecelerations.forEach(expectedDeceleration =>
          expect(dts).toContain(expectedDeceleration)
        )
      })

      test('should support union types', () => {
        const dts = getDtsForServiceByPath(
          './services/ProductPage.service.json'
        )
        const expectedDeceleration =
          'mediaItems: $w.Gallery.ImageItem[] | $w.Gallery.VideoItem[];'

        expect(dts).toContain(expectedDeceleration)
      })
    })
  })

  describe('callbacks', () => {
    describe('module', () => {
      test('should declare namespace with the same service name', () => {
        const dts = getDtsForServiceByPath('./services/wix-users.service.json')
        const expectedDeceleration = 'declare namespace wix_users {'

        expect(dts).toContain(expectedDeceleration)
      })

      test('should convert to type', () => {
        const dts = getDtsForServiceByPath('./services/wix-users.service.json')
        const expectedDeceleration =
          'type LoginHandler = (user: wix_users.User)=>void;'

        expect(dts).toContain(expectedDeceleration)
      })
    })

    describe('namespace', () => {
      test('should declare inner namespace with the same service name', () => {
        const dts = getDtsForServiceByPath('./services/Dataset.service.json')
        const expectedOuterDeceleration = 'declare namespace wix_dataset {'
        const expectedInnerDeceleration = 'namespace Dataset {'
        const unexpectedOuterDeceleration = 'declare namespace Dataset {'

        expect(dts).toContain(expectedOuterDeceleration)
        expect(dts).toContain(expectedInnerDeceleration)
        expect(dts).not.toContain(unexpectedOuterDeceleration)
      })

      test('should convert to type', () => {
        const dts = getDtsForServiceByPath('./services/Dataset.service.json')
        const expectedDeceleration =
          'type ErrorHandler = (operation: string, error: wix_dataset.Dataset.DatasetError)=>void;'

        expect(dts).toContain(expectedDeceleration)
      })
    })
  })

  test('a repo', async () => {
    let repo = await readFromDir('./test/services')

    let dts = docworksToDts(repo.services, { summaryTemplate })

    expect(dts).toMatchSnapshot()
  })
})

describe('filter services before converting to dts', () => {
  describe('filter module by name', () => {
    const $wService = require('./services/$w.service.json')
    const wixCrm = require('./services/wix-crm.service.json')
    const cartIcon = require('./services/CartIcon.service.json')

    const dts = docworksToDts([$wService, wixCrm, cartIcon], { summaryTemplate, ignoredModules: ['$w'] })

    expect(dts).not.toContain('declare module \'$w\'')
    expect(dts).toContain('declare module \'wix-crm\'')
    expect(dts).toContain('declare namespace $w')
  })

  describe('filter namespace by name', () => {
    const $wService = require('./services/$w.service.json')
    const wixCrm = require('./services/wix-crm.service.json')
    const cartIcon = require('./services/CartIcon.service.json')

    const dts = docworksToDts([$wService, wixCrm, cartIcon], { summaryTemplate, ignoredNamespaces: ['$w'] })

    expect(dts).toContain('declare module \'$w\'')
    expect(dts).toContain('declare module \'wix-crm\'')
    expect(dts).not.toContain('declare namespace $w')
  })
})
