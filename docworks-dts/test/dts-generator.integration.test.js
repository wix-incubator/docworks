const {type, create} = require('dts-dom')
const {getDtsType} = require('../lib/dts-generator')

describe('dts-generator', () => {

  describe('convert to dom-dts type:', () => {

    test('string', () => {
      expect(getDtsType('string')).toEqual(type.string)
    })

    test('Array<string>', () => {
      const docworksType = {name: 'Array', typeParams: ['string']}
      expect(getDtsType(docworksType)).toEqual('[string]')
    })

    test('boolean', () => {
      expect(getDtsType('boolean')).toEqual(type.boolean)
    })

    test('number', () => {
      expect(getDtsType('number')).toEqual(type.number)
    })

    test('Object', () => {
      expect(getDtsType('Object')).toEqual(type.object)
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
      const expectedValue = create.namedTypeReference('Promise<object>')
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })

    test('Promise<void>', () => {
      const docworksType = {name: 'Promise', typeParams: ['void']}
      const expectedValue = create.namedTypeReference(`Promise<${type.void}>`)
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })

    test('$w.Element & [$w.Element]', () => {
      const docworksType = ['$w.Element',
        {
          'name': 'Array',
          'typeParams':
            ['$w.Element']
        }]
      const expectedValue = create.intersection(['$w.Element', '[$w.Element]'])
      expect(getDtsType(docworksType, {intersection: true})).toEqual(expectedValue)
    })

    test('wix_window.trackingParameters.AddPaymentInfoEvent | wix_window.trackingParameters.AddProductImpressionEvent', () => {
      const docworksType = ['wix-window.trackingParameters.AddPaymentInfoEvent',
        'wix-window.trackingParameters.AddProductImpressionEvent']
      const expectedValue = create.union(['wix_window.trackingParameters.AddPaymentInfoEvent',
        'wix_window.trackingParameters.AddProductImpressionEvent'])
      expect(getDtsType(docworksType, {union: true})).toEqual(expectedValue)
    })

    test('Promise<[wix_users.User.PricingPlan]>', () => {
      const docworksType = {
        'name': 'Promise',
        'typeParams':
          [{
            'name': 'Array',
            'typeParams':
              ['wix-users.User.PricingPlan']
          }]
      }
      const expectedValue = create.namedTypeReference('Promise<[wix_users.User.PricingPlan]>')
      expect(getDtsType(docworksType)).toEqual(expectedValue)
    })
  })
})
