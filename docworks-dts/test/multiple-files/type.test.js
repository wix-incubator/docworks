
const multifilesMain = require('../../lib/multiple-files')
const { NEW_TYPE_STRCTURE_TEST_SERVICE_JSON } = require('./utils/new-type-strcture-test-service')
const summaryTemplate =
  '<%= model.summary %>\n\t[Read more..](https://fake-corvid-api/<%= model.service %>.html#<%= model.member %>)'

const run = services => {
  const [{content}] = multifilesMain(services, {summaryTemplate})
  return content
}
describe('type property strcture', () => {
  describe('convert to dom-dts types for new docs structure', () => {
    let content
    beforeAll(() => {
      content = run([NEW_TYPE_STRCTURE_TEST_SERVICE_JSON])
    })
    describe('nativeType', () => {
      test('primitive', () => {
        const expectedDecelerations = [
          'TestNativeTypeBoolean: boolean',
          'TestNativeTypeString: string'
        ]
        expectedDecelerations.forEach(deceleration => {
          expect(content).toContain(deceleration)
        })
      })
      test('Union', () => {
        const expectedDeceleration =
          'TestNativeTypeUnion: string | Buffer | Object'
        expect(content).toContain(expectedDeceleration)
      })
    })
    describe('complexType', () => {
      test('simple generics', () => {
        const expectedDeceleration =
          'TestComplexTypeSimpleGenerics: Promise<string>'
        expect(content).toContain(expectedDeceleration)
      })
      test('nested generics', () => {
        const expectedDeceleration =
          'TestComplexTypeNestedGenerics: Promise<Array<string>>'
        expect(content).toContain(expectedDeceleration)
      })
      test('record to map', () => {
        const expectedDeceleration =
          'TestComplexTypeRecordToMap: Map<string, boolean>'
        expect(content).toContain(expectedDeceleration)
      })
      test('record to map with key', () => {
        const expectedDeceleration =
          'TestComplexTypeRecordToMapWithKey: Map<boolean, string>'
        expect(content).toContain(expectedDeceleration)
      })
      test('map', () => {
        const expectedDeceleration =
          'TestComplexTypeMap: Record<string, string>'
        expect(content).toContain(expectedDeceleration)
      })
      test('generics nested & union', () => {
        const expectedDeceleration =
          'TestComplexTypeNestedGenericsAndUnion: Promise<Array<string> | null> | Promise<void>'
        expect(content).toContain(expectedDeceleration)
      })
    })
    describe('referenceType', () => {
      test('simple reference', () => {
        const expectedDeceleration =
          'TestReferenceTypeBulkUpdateResponse: Promise<wixDevBackend.Order.BulkUpdateResponse>'
        expect(content).toContain(expectedDeceleration)
      })
      test('generics nested union simple and reference type', () => {
        const expectedDeceleration =
          'TestReferenceTypeGenericsNestedUnionSimpleAndReferenceType: Promise<wixDevBackend.Order.BulkUpdateResponse | null>'
        expect(content).toContain(expectedDeceleration)
      })
    })
  })
})
