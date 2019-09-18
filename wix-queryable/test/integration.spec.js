const runJsDoc  = require('docworks-jsdoc2spec')
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

describe('wix-queryable - integration test', function() {
  describe('runJsDoc', function() {
    test('should load the queryable tag and add it to the service to the extra members', function() {
      let jsDocRes = runJsDoc(SOURCE_SERVICE_WITH_TAG, ['src/index'])

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

  describe('merge', function() {
    test('should detect changed queryable tag and add it', function () {
      let repo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, ['src/index'])
      let newRepo = runJsDoc(SOURCE_SERVICE_WITH_TAG, ['src/index'])

      let mergeResult = merge(newRepo.services, repo.services, ['src/index'])

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

    test('should detect changed queryable tag and remove it', function() {
      let repo = runJsDoc(SOURCE_SERVICE_WITH_TAG, ['src/index'])
      let newRepo = runJsDoc(SOURCE_SERVICE_WITHOUT_TAG, ['src/index'])

      let mergeResult = merge(newRepo.services, repo.services, ['src/index'])

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
