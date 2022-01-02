const VALID_DOCS_VALUE = {
  summary: '',
  description: [],
  links: [],
  examples: [],
  extra: {},
  request: 'NA'
}
const EXTRA_PROPS_VALUES = {
  labels: [],
  locations: [],
  customLabels: [],
  dynamicCustomLabels: [],
  docs: VALID_DOCS_VALUE
}
const NEW_TYPE_STRCTURE_TEST_SERVICE_JSON = {
  name: 'Test',
  mixes: [],
  labels: [],
  docs: VALID_DOCS_VALUE,
  properties: [
    {
      name: 'TestNativeTypeString',
      type: [{nativeType: 'string'}],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestNativeTypeBoolean',
      type: [{nativeType: 'boolean'}],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestNativeTypeUnion',
      type: [
        {nativeType: 'string'},
        {nativeType: 'Buffer'},
        {nativeType: 'Object'}
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeSimpleGenerics',
      type: [
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [{nativeType: 'string'}]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeNestedGenerics',
      type: [
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [
              {
                complexType: {
                  nativeType: 'Array',
                  typeParams: [{nativeType: 'string'}]
                }
              }
            ]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeRecordToMap',
      type: [
        {
          complexType: {
            nativeType: 'Map',
            typeParams: [{nativeType: 'string'}, {nativeType: 'boolean'}]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeRecordToMapWithKey',
      type: [
        {
          complexType: {
            nativeType: 'Map',
            typeParams: [
              {nativeType: 'string'},
              {nativeType: 'boolean', key: true}
            ]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeMap',
      type: [
        {
          complexType: {
            nativeType: 'Record',
            typeParams: [{nativeType: 'string'}, {nativeType: 'string'}]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestComplexTypeNestedGenericsAndUnion',
      type: [
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [
              {
                complexType: {
                  nativeType: 'Array',
                  typeParams: [{nativeType: 'string'}]
                }
              },
              {nativeType: 'null'}
            ]
          }
        },
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [{nativeType: 'void'}]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestReferenceTypeBulkUpdateResponse',
      type: [
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [
              {referenceType: 'wix-dev-backend.Order.BulkUpdateResponse'}
            ]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    },
    {
      name: 'TestReferenceTypeGenericsNestedUnionSimpleAndReferenceType',
      type: [
        {
          complexType: {
            nativeType: 'Promise',
            typeParams: [
              {referenceType: 'wix-dev-backend.Order.BulkUpdateResponse'},
              {nativeType: 'null'}
            ]
          }
        }
      ],
      ...EXTRA_PROPS_VALUES
    }
  ],
  operations: [],
  callbacks: [],
  messages: [],
  clientId: 'test'
}
module.exports = {
  NEW_TYPE_STRCTURE_TEST_SERVICE_JSON
}