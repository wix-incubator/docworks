const {type, create} = require('dts-dom')
const {getDtsType} = require('../lib/dts-generator')
const {createReferenceTypesMap} = require('../lib/utils')

describe('dts-generator', () => {

  describe('convert to dom-dts type:', () => {

    test('string', () => {
      expect(getDtsType('string')).toEqual(type.string)
    })

    test('Array<string>', () => {
      const docworksType = {name: 'Array', typeParams: ['string']}
      expect(getDtsType(docworksType)).toEqual('string[]')
    })

    test('boolean', () => {
      expect(getDtsType('boolean')).toEqual(type.boolean)
    })

    test('number', () => {
      expect(getDtsType('number')).toEqual(type.number)
    })

    test('Object', () => {
      expect(getDtsType('Object')).toEqual(type.any)
    })

    test('Date', () => {
      expect(getDtsType('Date')).toEqual('Date')
    })

    test('*', () => {
      expect(getDtsType('*')).toEqual(type.any)
    })

    test('$w.Element', () => {
      expect(getDtsType('$w.Element')).toEqual('$w.Element')
    })

    test('Promise<obj>', () => {
      const docworksType = {name: 'Promise', typeParams: ['Object']}
      const expectedValue = create.namedTypeReference('Promise<any>')
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })

    test('Promise<void>', () => {
      const docworksType = {name: 'Promise', typeParams: ['void']}
      const expectedValue = create.namedTypeReference(`Promise<${type.void}>`)
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })

    test('$w.Element & $w.Element[]', () => {
      const docworksType = ['$w.Element',
        {
          'name': 'Array',
          'typeParams':
            ['$w.Element']
        }]
      const expectedValue = create.intersection(['$w.Element', '$w.Element[]'])
      expect(getDtsType(docworksType, {intersection: true})).toEqual(expectedValue)
    })

    test('wix_window.trackingParameters.AddPaymentInfoEvent | wix_window.trackingParameters.AddProductImpressionEvent', () => {
      const docworksType = ['wix-window.trackingParameters.AddPaymentInfoEvent',
        'wix-window.trackingParameters.AddProductImpressionEvent']
      const expectedValue = create.union(['wix_window.trackingParameters.AddPaymentInfoEvent',
        'wix_window.trackingParameters.AddProductImpressionEvent'])
      expect(getDtsType(docworksType, {union: true})).toEqual(expectedValue)
    })

    test('Promise<wix_users.User.PricingPlan[]>', () => {
      const docworksType = {
        'name': 'Promise',
        'typeParams':
          [{
            'name': 'Array',
            'typeParams':
              ['wix-users.User.PricingPlan']
          }]
      }
      const expectedValue = create.namedTypeReference('Promise<wix_users.User.PricingPlan[]>')
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })

  })

  describe('convert to dom-dts types for new docs structure', () => {

    describe('NativeType', () => {
      test('Simple', () => {
        const docsSimpleComplexType = [
          { 'nativeType': 'boolean' }
        ]
        
        const typeRes = create.namedTypeReference('boolean')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })

      test('Union', () => {
        const docsSimpleComplexType = [
          { 'nativeType': 'string' },
          { 'nativeType': 'Buffer' },
          { 'nativeType': 'Object' }
        ]

        const typeRes = create.namedTypeReference('string | Buffer | Object')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })
    })

    describe('ComplexType', () => {
      
      test('Simple Generics', () => {
        const docsSimpleComplexType = [{ 
          'complexType': {
            'nativeType': 'Promise',
            'typeParams': [
              { 'nativeType': 'string' }
            ]
          }
        }]
        const expectedValue = create.namedTypeReference('Promise<string>')
        expect(getDtsType(docsSimpleComplexType)).toEqual(expectedValue)
      })
  
     
      test('Nested Generics', () => {
        const docsSimpleComplexType = [
          { 'complexType': { 
              'nativeType': 'Promise',
              'typeParams': [
                { 'complexType': {
                    'nativeType': 'Array',
                    'typeParams': [{'nativeType': 'string'}]
                  }
                }
              ]
            }
          }
        ]
  
        const typeRes = create.namedTypeReference('Promise<Array<string>>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })

      test('Record to Map', () => {
        const docsSimpleComplexType = [{ 
          'complexType': {
            'nativeType': 'Map',
            'typeParams': [{'nativeType': 'string'}, {'nativeType': 'boolean'}]
          }
        }]
  
        const typeRes = create.namedTypeReference('Map<string, boolean>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })
      
      test('Record to Map with key', () => {
        const docsSimpleComplexType = [{ 
          'complexType': {
            'nativeType': 'Map',
            'typeParams': [{'nativeType': 'string'}, {'nativeType': 'boolean', 'key': true}]
          }
        }]
  
        const typeRes = create.namedTypeReference('Map<boolean, string>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })

      test('Map', () => {
        const docsSimpleComplexType = [{ 
          'complexType': {
            'nativeType': 'Record',
            'typeParams': [{'nativeType': 'string'}, {'nativeType': 'string'}]
          }
        }]
  
        const typeRes = create.namedTypeReference('Map<string, string>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })

      test('Generics Nested + Union', () => {
        const docsSimpleComplexType = [
          { 'complexType': {
              'nativeType': 'Promise',
              'typeParams': [
                {
                  'unionType': {
                    'type': [
                      { 'complexType': { 
                          'nativeType': 'Array', 
                          'typeParams': [{'nativeType': 'string'}]
                        }
                      },
                      { 'nativeType': 'null' }
                    ]
                  }
                }
              ]
            }
          },
          { 'complexType': {
              'nativeType': 'Promise',
              'typeParams': [ {'nativeType': 'void'} ]
            }
          }
        ]
  
        const typeRes = create.namedTypeReference('Promise<Array<string> | null> | Promise<void>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })
  
    })
    

    describe('ReferenceType', () => {
      test('EchoRequest', () => {
        const docsSimpleComplexType = [{
          'complexType': {
            'nativeType': 'Promise',
            'typeParams': [{'referenceType': 'wix-dev-backend.Order.BulkUpdateResponse'}]
          }
        }]

        const ordersService = require('./services/Order.service.json')
        global.referenceTypesMap = createReferenceTypesMap([ordersService])
        
        const typeRes = create.namedTypeReference('Promise<wix_dev_backend.Order.BulkUpdateResponse>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })

      test('Generics Nested Union Simple and Reference type', () => {
        const docsSimpleComplexType = [
          { 'complexType': {
            'nativeType': 'Promise',
            'typeParams': [
              {
                'unionType': {
                  'type': [
                    { 'referenceType': 'wix-dev-backend.Order.BulkUpdateResponse' },
                    { 'nativeType': 'null' }
                  ]
                }
              }
            ]
          }
        },
          
        ]

        const ordersService = require('./services/Order.service.json')
        global.referenceTypesMap = createReferenceTypesMap([ordersService])
        
        const typeRes = create.namedTypeReference('Promise<wix_dev_backend.Order.BulkUpdateResponse | null>')
        const receivedValue = getDtsType(docsSimpleComplexType)
        expect(receivedValue).toEqual(typeRes)
      })
    })
  })
})
