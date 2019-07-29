const {readFromDir} = require('docworks-repo')
const docworksToDts = require('../lib/dts-repo')

describe('convert docworks to dts', () => {

    function getDtsForServiceByPath(servicePath) {
        const service = require(servicePath)
        return docworksToDts([service])

    }

    describe('services', () => {
        test('should convert service to module if it is the root(does not have memberOf value)', () => {
            const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
            const expectedDeceleration = 'declare module \'wix-crm\''

            expect(dts).toContain(expectedDeceleration)
        })

        test('should convert service to interface if it is not the root(has memberOf value)', () => {
            const dts = getDtsForServiceByPath('./services/StyleMixin.service.json')
            const expectedDeceleration = 'interface StyleMixin'

            expect(dts).toContain(expectedDeceleration)
        })

        test('should convert service parent(memberOf) to a namespace', () => {
            const dts = getDtsForServiceByPath('./services/StyleMixin.service.json')
            const expectedDeceleration = 'declare namespace $w'

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
        })

        describe('namespace', () => {

            test('should convert to read-only property', () => {
                const dts = getDtsForServiceByPath('./services/StyleMixin.service.json')
                const expectedDeceleration = 'readonly style: $w.Style;'

                expect(dts).toContain(expectedDeceleration)
            })

            test('should convert to read-write property', () => {
                const dts = getDtsForServiceByPath('./services/RequiredMixin.service')
                const expectedDeceleration = 'required: boolean;'

                expect(dts).toContain(expectedDeceleration)
                expect(dts).not.toContain('readonly')
            })
        })

    })

    describe('operations', () => {
        describe('module', () => {
            test('should convert to function', () => {
                const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
                const expectedDeceleration = 'function createContact(contactInfo: wix_crm.ContactInfo): Promise<string>;'

                expect(dts).toContain(expectedDeceleration)
            })

            test('should convert to function with optional arguments', () => {
                const dts = getDtsForServiceByPath('./services/wix-users.service.json')
                const expectedDeceleration = 'function emailUser(emailId: string, toUser: string, options?: wix_users.TriggeredEmailOptions): Promise<void>;'

                expect(dts).toContain(expectedDeceleration)
            })
        })

        describe('namespace', () => {
            test('should convert to method', () => {
                const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
                const expectedDeceleration = 'addProductsToCart(products: [$w.CartIcon.AddToCartItem]): Promise<void>;'

                expect(dts).toContain(expectedDeceleration)
            })

            test('should convert to method with optional parameter', () => {
                const dts = getDtsForServiceByPath('./services/CartIcon.service.json')
                const expectedDeceleration = 'addToCart(productID: string, quantity?: number, options?: $w.CartIcon.AddToCartOptions): Promise<void>;'

                expect(dts).toContain(expectedDeceleration)
            })
        })
    })

    describe('messages', () => {
        describe('module', () => {
            test('should declare namespace with the same service name', () => {
                const dts = getDtsForServiceByPath('./services/wix-crm.service.json')
                const expectedDeceleration = 'declare namespace wix_crm'

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
                    'emails: [string];',
                    'loginEmail: string;',
                    'phones: [string];',
                    'labels: [string];',
                    'language: string;',
                    'customFields: string;'
                ]

                expectedDecelerations.forEach(expectedDeceleration => expect(dts).toContain(expectedDeceleration))
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

                expectedDecelerations.forEach(expectedDeceleration => expect(dts).toContain(expectedDeceleration))
            })
        })
    })

    describe('callbacks', () => {
        describe('module', () => {
            test('should declare namespace with the same service name', () => {
                const dts = getDtsForServiceByPath('./services/wix-users.service.json')
                const expectedDeceleration = 'declare namespace wix_users'

                expect(dts).toContain(expectedDeceleration)
            })

            test('should convert to type', () => {
                const dts = getDtsForServiceByPath('./services/wix-users.service.json')
                const expectedDeceleration = 'type LoginHandler = (user: wix_users.User)=>void;'

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
                const expectedDeceleration = 'type ErrorHandler = (operation: string, error: wix_dataset.Dataset.DatasetError)=>void;'

                expect(dts).toContain(expectedDeceleration)
            })
        })
    })

    test('a repo', async () => {
        let repo = await readFromDir('./test/services')

        let dts = docworksToDts(repo.services)

        expect(dts).toMatchSnapshot()
    })
})