const runJsDoc = require('docworks-jsdoc2spec')
const {merge} = require('docworks-repo')

const sourceWithTagService = {'include': ['test/Service.withTag.service.js']}
const sourceWithTwoTagService = {'include': ['test/Service.withTwoTags.service.js']}
const sourceWithoutTagService = {'include': ['test/Service.withoutTag.service.js']}
const updatedSourceWithTagService = {'include': ['test/updatedService.withTag.service.js']}
const wixCustomLabelPluginPath = ['src/index']

describe('integration test', function () {
  describe('runJsDoc', function () {
    it('should load the custom-labels tag and add it to the extra property of the service', function () {
      const jsDocRes = runJsDoc(sourceWithTagService, wixCustomLabelPluginPath)
      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            extra: {
              customLabels: [{id: 'maturity-service'}]

            }
          })
        ])
      )
    })

    it('should load two custom-labels and add them to the extra property of the service', function () {
      const jsDocRes = runJsDoc(sourceWithTwoTagService, wixCustomLabelPluginPath)
      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            extra: {
              customLabels: [{id: 'maturity-service'}, {id: 'maturity-preview'}]

            }
          })
        ])
      )
    })

    it('should load the custom-labels tag and add it to the extra property of the operation', function () {
      const jsDocRes = runJsDoc(sourceWithTagService, wixCustomLabelPluginPath)
      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            operations: expect.arrayContaining([
              expect.objectContaining({
                name: 'operation',
                extra: {
                  customLabels: [{id: 'maturity-operation'}]
                }
              })
            ])
          })
        ])
      )
    })

    it('should load two custom-labels and add them to the extra property of the operation', function () {
      const jsDocRes = runJsDoc(sourceWithTwoTagService, wixCustomLabelPluginPath)
      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            operations: expect.arrayContaining([
              expect.objectContaining({
                name: 'operation',
                extra: {
                  customLabels: [{id: 'maturity-operation'}, {id: 'maturity-preview'}]
                }
              })
            ])
          })
        ])
      )
    })
  })

  describe('merge', function () {
    it('should detect changed label', function () {
      const repo = runJsDoc(sourceWithTagService, wixCustomLabelPluginPath)
      const newRepo = runJsDoc(updatedSourceWithTagService, wixCustomLabelPluginPath)
      const mergeResult = merge(newRepo.services, repo.services, wixCustomLabelPluginPath)

      expect(mergeResult.messages).toEqual(expect.arrayContaining(['Service aNamespace.Service operation operation has changed extra.customLabels']))
      expect(mergeResult.repo).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Service',
            memberOf: 'aNamespace',
            operations: expect.arrayContaining([
              expect.objectContaining({
                name: 'operation',
                extra: {
                  customLabels: [
                    {id: 'maturity-updated'}
                  ]
                }
              })
            ]),
            extra: {
              customLabels: [{id: 'maturity-service-update'}]
            }
          })
        ])
      )
    })
  })


  describe('when a previously custom-labels service becomes not-custom-labels', function () {
    it('should remove custom-labels if tag was removed', function () {
      const repo = runJsDoc(sourceWithTagService, wixCustomLabelPluginPath)
      const newRepo = runJsDoc(sourceWithoutTagService, wixCustomLabelPluginPath)
      const mergeResult = merge(newRepo.services, repo.services, wixCustomLabelPluginPath)

      expect(mergeResult.messages).toEqual(
        expect.arrayContaining(['Service aNamespace.Service has changed extra.customLabels']))
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
