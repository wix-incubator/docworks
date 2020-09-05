const runJsDoc = require('docworks-jsdoc2spec')
const {merge} = require('docworks-repo')

const SOURCE_SERVICE_WITHOUT_TAG = {
  'include': [
    'test/Service.withoutTag.service.js'
  ],
}

const SOURCE_SERVICE_WITH_SINGLE_TAG = {
  'include': [
    'test/Service.withSingleTag.service.js'
  ],
}

const SOURCE_SERVICE_WITH_MULTIPLE_TAGS = {
  'include': [
    'test/Service.withMultipleTags.service.js'
  ],
}

const SOURCE_SERVICE_WITH_INVALID_TAG = {
  'include': [
    'test/Service.withInvalidTag.service.js'
  ],
}

const SOURCE_SERVICE_WITH_DUPLICATED_TAG = {
  'include': [
    'test/Service.withDuplicatedTag.service.js'
  ],
}

const SOURCE_SERVICE_WITH_NON_EXISTING_PROPERTY = {
  'include': [
    'test/Service.withNonExistingProperty.service.js'
  ],
}

const ONE_OF_PLUGIN_PATH = ['src/index']

describe('wix-one-of - integration test', () => {
  describe('runJsDoc', () => {
    test('should load the oneof tag and add it to the message object and mark all oneof members as optional', () => {
      let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_SINGLE_TAG, ONE_OF_PLUGIN_PATH)
      const jsDocService = jsDocRes.services.find(s => s.name === 'Service')

      expect(jsDocService.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
                name: 'Message',
                members: [
                  {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                  {name: 'address', type: 'string', doc: 'is optional', optional: true},
                  {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                  {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: true},
                  {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1',optional: undefined},
                  {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
                ],
                extra: {oneOfGroups: [{name: 'age_group', members: ['age', 'yearOfBirth']}]}
              })
        ])
      )
    })

      test('should load multiple oneof tags and add them to the message object and mark all oneof members as optional', () => {
        let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_MULTIPLE_TAGS, ONE_OF_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: true},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1', optional: true},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: true}
              ],
              extra: {oneOfGroups: [
                {name: 'age_group', members: ['age', 'yearOfBirth']},
                {name: 'id_group', members: ['idNumber', 'passportId']}
                ]}
            })
          ])
        )
    })
  })

  describe('merge', () => {
    describe('when a one of group is added to a message', () => {
      test('should add oneOfGroups property with the new group', () => {
        let repo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, ONE_OF_PLUGIN_PATH)
        let newRepo = runJsDoc(SOURCE_SERVICE_WITH_SINGLE_TAG, ONE_OF_PLUGIN_PATH)

        let mergeResult = merge(newRepo.services, repo.services, ONE_OF_PLUGIN_PATH)
        expect(mergeResult.messages).toEqual(
          expect.arrayContaining(['Service aNamespace.Service message Message member age has changed optional',
            'Service aNamespace.Service message Message member yearOfBirth has changed optional',
            'Service aNamespace.Service message Message has changed extra.oneOfGroups'])
        )

        const jsDocService = mergeResult.repo.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: true},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1', optional: undefined},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
              ],
              extra: {oneOfGroups: [{name: 'age_group', members: ['age', 'yearOfBirth']}]}
            })
          ])
        )
      })

      test('should add oneOfGroups property with multiple groups', () => {
        let repo = runJsDoc(SOURCE_SERVICE_WITH_SINGLE_TAG, ONE_OF_PLUGIN_PATH)
        let newRepo = runJsDoc(SOURCE_SERVICE_WITH_MULTIPLE_TAGS, ONE_OF_PLUGIN_PATH)

        let mergeResult = merge(newRepo.services, repo.services, ONE_OF_PLUGIN_PATH)
        expect(mergeResult.messages).toEqual(
          expect.arrayContaining(['Service aNamespace.Service message Message member idNumber has changed optional',
            'Service aNamespace.Service message Message member passportId has changed optional',
            'Service aNamespace.Service message Message has changed extra.oneOfGroups'])
        )

        const jsDocService = mergeResult.repo.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: true},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1', optional: true},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: true}
              ],
              extra: {
                oneOfGroups: [
                  {name: 'age_group', members: ['age', 'yearOfBirth']},
                  {name: 'id_group', members: ['idNumber', 'passportId']}
                  ]
              }
            })
          ])
        )
      })
    })

    describe('when a oneof group is removed from a message', () => {

      test('should remove the oneOfGroups property', () => {
        let repo = runJsDoc(SOURCE_SERVICE_WITH_SINGLE_TAG, ONE_OF_PLUGIN_PATH)
        let newRepo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, ONE_OF_PLUGIN_PATH)

        let mergeResult = merge(newRepo.services, repo.services, ONE_OF_PLUGIN_PATH)
        expect(mergeResult.messages).toEqual(
          expect.arrayContaining(['Service aNamespace.Service message Message member age has changed optional',
            'Service aNamespace.Service message Message member yearOfBirth has changed optional',
            'Service aNamespace.Service message Message has changed extra.oneOfGroups'])
        )

        const jsDocService = mergeResult.repo.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: undefined},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: undefined},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1', optional: undefined},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
              ],
              extra: {}
            })
          ])
        )
      })
    })
  })

  describe('invalid input', () => {
    describe('when tag does not include any property name', () => {
      test('should ignore the oneof tag', () => {
        let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_INVALID_TAG, ONE_OF_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: undefined},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: undefined},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1',optional: undefined},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
              ],
              extra: {}
            })
          ])
        )
      })
    })

    describe('when the same property belongs to 2 different oneOf groups', () => {
      test('should ignore the second oneof group', () => {
        let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_DUPLICATED_TAG, ONE_OF_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: true},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1',optional: undefined},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
              ],
              extra: {oneOfGroups: [{name: 'age_group1', members: ['age', 'yearOfBirth']}]}
            })
          ])
        )
      })
    })

    describe('when tag include non existing property name', () => {
      test('should ignore the non existing property', () => {
        let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_NON_EXISTING_PROPERTY, ONE_OF_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')

        expect(jsDocService.messages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Message',
              members: [
                {name: 'name', type: 'string', doc: 'is mandatory', optional: undefined},
                {name: 'address', type: 'string', doc: 'is optional', optional: true},
                {name: 'age', type: 'number', doc: 'is oneOf group 1 prop 1', optional: true},
                {name: 'yearOfBirth', type: ['number', 'string'], doc: 'is oneOf group 1 prop 2', optional: undefined},
                {name: 'idNumber', type: 'number', doc: 'is oneOf group 2 prop 1',optional: undefined},
                {name: 'passportId', type: 'number', doc: 'is oneOf group 2 prop 2', optional: undefined}
              ],
              extra: {oneOfGroups: [{name: 'age_group', members: ['age']}]}
            })
          ])
        )
      })
    })
  })
})
