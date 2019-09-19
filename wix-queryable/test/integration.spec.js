const runJsDoc = require('docworks-jsdoc2spec')
const {merge} = require('docworks-repo')

const SOURCE_SERVICE_WITH_TAG = {
  'include': [
    'test/Service.withTag.service.js'
  ],
}

const SOURCE_SERVICE_WITHOUT_TAG = {
  'include': [
    'test/Service.withoutTag.service.js'
  ],
}

const QUERYABLE_PLUGIN_PATH = ['src/index']

describe('wix-queryable - integration test', () => {
  describe('runJsDoc', () => {
    test('should load the queryable tag and add it to the service to the extra members', function () {
      let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_TAG, QUERYABLE_PLUGIN_PATH)

      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            extra: {
              queryable: true
            }
          })
        ])
      )
    })
  })

  describe('merge', () => {
    describe('when a previously non-queryable service becomes queryable', () => {
      test('should add the queryable property', () => {
        let repo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, QUERYABLE_PLUGIN_PATH)
        let newRepo = runJsDoc(SOURCE_SERVICE_WITH_TAG, QUERYABLE_PLUGIN_PATH)

        let mergeResult = merge(newRepo.services, repo.services, QUERYABLE_PLUGIN_PATH)

        expect(mergeResult.messages).toEqual(
          expect.arrayContaining(['Service aNamespace.Service has changed extra.queryable'])
        )
        expect(mergeResult.repo).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Service',
              memberOf: 'aNamespace',
              extra: {
                queryable: true
              }
            })
          ])
        )
      })
    })

    describe('when a previously queryable service becomes not-queryable', () => {

      test('should remove the queryable property', () => {
        let repo = runJsDoc(SOURCE_SERVICE_WITH_TAG, QUERYABLE_PLUGIN_PATH)
        let newRepo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, QUERYABLE_PLUGIN_PATH)

        let mergeResult = merge(newRepo.services, repo.services, QUERYABLE_PLUGIN_PATH)

        expect(mergeResult.messages).toEqual(
          expect.arrayContaining(['Service aNamespace.Service has changed extra.queryable'])
        )
        expect(mergeResult.repo).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Service',
              memberOf: 'aNamespace',
              extra: {}
            })
          ])
        )
      })
    })
  })
})
