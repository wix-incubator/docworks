const path = require('path')
const { readFromDir } = require('docworks-repo')
const multifilesMain = require('../../lib/multiple-files')
const { DETACHED_SERVICE_JSON, EMPTY_SERVICE_JSON, SERVICE_JSON_WITH_REMOVED_ITEMS, REMOVED_SERVICE_JSON, SERVICE_AND_REMOVED_SUB_SERVICE } = require('./utils/servicesMocks')
const summaryTemplate =
	'<%= model.summary %>\n\t[Read more..](https://fake-corvid-api/<%= model.service %>.html#<%= model.member %>)'

const getServiceJson = servicePath =>
	require(path.join('../services/', servicePath))
const run = paths => {
	const services = paths.map(getServiceJson)
	return multifilesMain(services, { summaryTemplate })
}
describe('convert docworks to dts', () => {
	describe('main', () => {
		test('should build a repo when the input is valid', async () => {
			let { services } = await readFromDir('test/services')

			const wixModules = multifilesMain(services, { summaryTemplate })

			expect(wixModules.map(m => m.content).join('\n')).toMatchSnapshot()
		})
		test('should throw an error if the input is incomplete (missing direct parent)', async () => {
			const { services } = await readFromDir('test/services')
			const buildRepo = () => {
				multifilesMain(
					services.concat([DETACHED_SERVICE_JSON]),
					{ summaryTemplate }
				)
			}

			expect(buildRepo).toThrow(
				'Test service json. can\'t find parent service wix-unknown-module.'
			)
		})
	})

	describe('documentation links', () => {
		test('should generate documentation link to modules', () => {
			const [{ content }] = run(['wix-users.service.json'])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/wix-users.html#)'
			expect(content).toContain(expectedDocLink)
		})

		test('should generate documentation link to interfaces', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json'
			])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/$w.ClickableMixin.html#)'

			expect(content).toContain(expectedDocLink)
		})

		test('should generate documentation link to consts', () => {
			const [{ content }] = run(['wix-storage.service.json'])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/wix-storage.html#local)'

			expect(content).toContain(expectedDocLink)
		})

		test('should generate documentation link to properties', () => {
			const [{ content }] = run(['$w.service.json', 'Gallery.service.json'])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/$w.Gallery.html#currentIndex)'

			expect(content).toContain(expectedDocLink)
		})

		test('should generate documentation link to mixins methods', () => {
			const [{ content }] = run([
				'$w.service.json',
				'ClickableMixin.service.json'
			])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/$w.ClickableMixin.html#onClick)'

			expect(content).toContain(expectedDocLink)
		})

		test('should generate documentation link to members methods', () => {
			const [{ content }] = run(['wix-users.service.json'])
			const expectedDocLink =
				'[Read more..](https://fake-corvid-api/wix-users.html#emailUser)'

			expect(content).toContain(expectedDocLink)
		})
	})

	describe('services', () => {

    test('should use the display name of the service json instead of the name', () => {
      const [{ content }] = run(['wix-dot-convention-backend.service.json'])
      const expectedDeceleration = 'wix-dot-backend.v2'
      const unExpectedDeceleration = 'wix-dot-backend-v2'

      expect(content).toContain(expectedDeceleration)
      expect(content).not.toContain(unExpectedDeceleration)
    })
		test('should convert service to module if it is the root(does not have memberOf value)', () => {
			const [{ content }] = run(['wix-crm.service.json'])
			const expectedDeceleration = 'declare module \'wix-crm\' {'

			expect(content).toContain(expectedDeceleration)
		})

		test('should convert service to interface if it is not the root(has memberOf value)', () => {
			const [{ content }] = run(['$w.service.json', 'StyleMixin.service.json'])
			const expectedDeceleration = 'interface StyleMixin {'

			expect(content).toContain(expectedDeceleration)
		})

		test('should convert $w service parent (memberOf) to a namespace', () => {
			const [{ content }] = run(['$w.service.json', 'StyleMixin.service.json'])
			const expectedDeceleration = 'namespace $w {'

			expect(content).toContain(expectedDeceleration)
		})

		test('should convert root service (not $w) to a module', () => {
			const [{ content }] = run(['User.service.json', 'wix-users.service.json'])
			const expectedDeceleration = 'declare module \'wix-users\' {'

			expect(content).toContain(expectedDeceleration)
		})

		test('should convert sub services to an inner namespace', () => {
			const [{ content }] = run(['User.service.json', 'wix-users.service.json'])
			const expectedDeceleration = 'namespace User {'

			expect(content).toContain(expectedDeceleration)
		})
		test('should declare $w as global namespace', () => {
			const [{ content }] = run([
				'$w.service.json',
				'Gallery.service.json',
				'StyleMixin.service.json',
				'ClickableMixin.service.json'
			])
			const expectedDeceleration1 = 'declare global {'
			const expectedDeceleration2 = 'namespace $w {'

			expect(content).toContain(expectedDeceleration1)
			expect(content).toContain(expectedDeceleration2)
		})
		test('should filter empty modules', () => {
			const [{ content }] = multifilesMain([EMPTY_SERVICE_JSON], { summaryTemplate })

			expect(content).toEqual('')
		})
		test('should filter removed modules', ()=>{
			const [{ content }] = multifilesMain([REMOVED_SERVICE_JSON], { summaryTemplate })

			expect(content).toEqual('')
		})
		test('should filter removed properties, messages, callbacks, operations', ()=>{
			const [{ content }] = multifilesMain([SERVICE_JSON_WITH_REMOVED_ITEMS], { summaryTemplate })

			expect(content).toMatchSnapshot()
		})
		test('should filter subservice with removed label', ()=>{
			const wixModules = multifilesMain([SERVICE_AND_REMOVED_SUB_SERVICE.service, SERVICE_AND_REMOVED_SUB_SERVICE.removedSubService], { summaryTemplate })

			expect(wixModules.map(m => m.content).join('\n')).toMatchSnapshot()
		})
	})

	describe('properties', () => {
		describe('module', () => {
			test('should convert to const', () => {
				const [{ content }] = run(['wix-users.service.json'])
				const expectedDeceleration = 'const currentUser: User;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should union types', () => {
				const [{ content }] = run(['wix-site.service.json'])
				const expectedDeceleration =
					'const currentPage: StructurePage | StructureLightbox;'

				expect(content).toContain(expectedDeceleration)
			})
		})

		describe('namespace', () => {
			test('should convert to read-only property', () => {
				const [{ content }] = run([
					'$w.service.json',
					'StyleMixin.service.json'
				])
				const expectedDeceleration = 'readonly style: Style;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to read-write property', () => {
				const [{ content }] = run([
					'$w.service.json',
					'RequiredMixin.service.json'
				])
				const expectedDeceleration = 'required: boolean;'
				const unexpectedDeceleration = 'readonly required: boolean;'

				expect(content).toContain(expectedDeceleration)
				expect(content).not.toContain(unexpectedDeceleration)
			})

			test('should convert to property with union type', () => {
				const [{ content }] = run(['$w.service.json', 'Gallery.service.json'])
				const expectedDeceleration =
					'readonly currentItem: Gallery.ImageItem | Gallery.VideoItem;'

				expect(content).toContain(expectedDeceleration)
			})
		})
	})
	describe('operations', () => {
		describe('module', () => {
			test('should convert to function', () => {
				const [{ content }] = run(['wix-crm.service.json'])
				const expectedDeceleration =
					'function createContact(contactInfo: ContactInfo): Promise<string>;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to function with optional arguments', () => {
				const [{ content }] = run(['wix-users.service.json'])
				const expectedDeceleration =
					'function emailUser(emailId: string, toUser: string, options?: TriggeredEmailOptions): Promise<void>;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to function with union type as parameter', () => {
				const [{ content }] = run(['wix-router.service.json'])
				const expectedDeceleration =
					'function ok(Page: string | string[], routerReturnedData?: any, head?: WixRouterResponse.HeadOptions): Promise<WixRouterResponse>;'

				expect(content).toContain(expectedDeceleration)
			})
		})

		describe('namespace', () => {
			test('should convert to method', () => {
				const [{ content }] = run(['$w.service.json', 'CartIcon.service.json'])
				const expectedDeceleration =
					'addProductsToCart(products: CartIcon.AddToCartItem[]): Promise<void>;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to method with optional parameter', () => {
				const [{ content }] = run(['$w.service.json', 'CartIcon.service.json'])
				const expectedDeceleration =
					'addToCart(productID: string, quantity?: number, options?: CartIcon.AddToCartOptions): Promise<void>;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to method union type parameters', () => {
				const [{ content }] = run([
					'$w.service.json',
					'HtmlComponent.service.json'
				])
				const expectedDeceleration =
					'postMessage(message: string | number | boolean | any | Array): void;'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert to method with rest type as parameter', () => {
				const [{ content }] = run([
					'wix-data.service.json',
					'WixDataAggregate.service.json'
				])
				const expectedDeceleration =
					'ascending(...propertyName: string[]): WixDataAggregate;'

				expect(content).toContain(expectedDeceleration)
			})
		})
	})

	describe('messages', () => {
		describe('module', () => {
			test('should NOT declare namespace with the same service name', () => {
				const [{ content }] = run(['wix-crm.service.json'])
				const expectedDeceleration = 'declare namespace wix_crm {'

				expect(content).not.toContain(expectedDeceleration)
			})

			test('should convert to type', () => {
				const [{ content }] = run(['wix-crm.service.json'])
				const expectedDeceleration = 'type ContactInfo = {'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert all type\'s members to properties', () => {
				const [{ content }] = run(['wix-crm.service.json'])
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
					expect(content).toContain(expectedDeceleration)
				)
			})
		})

		describe('namespace', () => {
			test('should declare inner namespace with the same service name', () => {
				const [{ content }] = run(['$w.service.json', 'CartIcon.service.json'])
				const expectedOuterDeceleration = 'namespace $w {'
				const expectedInnerDeceleration = 'namespace CartIcon {'
				const unexpectedOuterDeceleration = 'declare namespace CartIcon {'

				expect(content).toContain(expectedOuterDeceleration)
				expect(content).toContain(expectedInnerDeceleration)
				expect(content).not.toContain(unexpectedOuterDeceleration)
			})

			test('should convert to type', () => {
				const [{ content }] = run(['$w.service.json', 'CartIcon.service.json'])
				const expectedDeceleration = 'type AddToCartItem = {'

				expect(content).toContain(expectedDeceleration)
			})

			test('should convert all type\'s members to properties', () => {
				const [{ content }] = run(['$w.service.json', 'CartIcon.service.json'])
				const expectedDecelerations = [
					'productID: string;',
					'options?: CartIcon.AddToCartOptions;'
				]

				expectedDecelerations.forEach(expectedDeceleration =>
					expect(content).toContain(expectedDeceleration)
				)
			})

			test('should support union types', () => {
				const [{ content }] = run([
					'$w.service.json',
					'ProductPage.service.json'
				])
				const expectedDeceleration =
					'mediaItems: Gallery.ImageItem[] | Gallery.VideoItem[];'

				expect(content).toContain(expectedDeceleration)
			})
		})
	})

	describe('callbacks', () => {
		describe('module', () => {
			test('should convert to type', () => {
				const [{ content }] = run(['wix-users.service.json'])
				const expectedDeceleration = 'type LoginHandler = (user: User)=>void;'

				expect(content).toContain(expectedDeceleration)
			})
		})

		describe('namespace', () => {
			test('should declare inner namespace with the same service name', () => {
				const [{ content }] = run([
					'wix-dataset.service.json',
					'Dataset.service.json'
				])

				const expectedOuterDeceleration = 'declare module \'wix-dataset\' {'
				const expectedInnerDeceleration = 'namespace Dataset {'
				const unexpectedOuterDeceleration = 'declare namespace Dataset {'

				expect(content).toContain(expectedOuterDeceleration)
				expect(content).toContain(expectedInnerDeceleration)
				expect(content).not.toContain(unexpectedOuterDeceleration)
			})

			test('should convert to type', () => {
				const [{ content }] = run([
					'wix-dataset.service.json',
					'Dataset.service.json'
				])
				const expectedDeceleration =
					'type ErrorHandler = (operation: string, error: Dataset.DatasetError)=>void;'

				expect(content).toContain(expectedDeceleration)
			})
		})
	})
})

describe('filter services before converting to dts', () => {
	test('filter module by name', () => {
		const $wService = require('../services/$w.service.json')
		const wixCrm = require('../services/wix-crm.service.json')
		const cartIcon = require('../services/CartIcon.service.json')
		const wixUsers = require('../services/wix-users.service.json')

		const dts = multifilesMain([$wService, wixCrm, cartIcon, wixUsers], {
			summaryTemplate,
			ignoredModules: ['$w', 'wix-users']
		})
			.map(file => file.content)
			.join('\n')

		expect(dts).toContain('declare module \'wix-crm\'')
		expect(dts).not.toContain('declare module \'wix-users\'')
		expect(dts).not.toContain('declare namespace $w')
		expect(dts).not.toContain('CartIcon')
	})
})

describe('cross reference types', () => {
	test('should generate an import statement and refer to the type parent module associated with the statement', () => {
		const [{ content }] = run(['wix-users.service.json'])
		const expectedDecelerations = [
      'import wixCrm from \'wix-crm\';',
			'contactInfo: wixCrm.ContactInfo;'
    ]

		expectedDecelerations.forEach(expectedDeceleration =>
      expect(content).toContain(expectedDeceleration)
    )
	})
})
