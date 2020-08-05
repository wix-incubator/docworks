import runJsDoc from 'docworks-jsdoc2spec'
import {merge} from 'docworks-repo'
import chai from 'chai'
import chaiSubset from 'chai-subset'

const expect = chai.expect
chai.use(chaiSubset)

const SOURCE_withTag_SERVICE = {'include': ['test/Service.withTag.service.js']}
const SOURCE_withoutTag_SERVICE = {'include': ['test/Service.withoutTag.service.js']}
const UPDATED_SOURCE_withTag_SERVICE = {'include': ['test/updatedService.withTag.service.js']}
const WIX_CUSTOM_LABELS_PATH = ['src/index']

describe('integration test', function () {
  describe('runJsDoc', function () {
    it('should load the custom-labels tag and add it to the extra property of the service', function () {
      const jsDocRes = runJsDoc(SOURCE_withTag_SERVICE, WIX_CUSTOM_LABELS_PATH)
      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'Service', memberOf: 'aNamespace',
            extra: {
              customLabels: [{id: 'maturity-service'}]

            }
          }
        ]
      })
    })

    it('should load the custom-labels tag and add it to the extra property of the operation', function () {
      const jsDocRes = runJsDoc(SOURCE_withTag_SERVICE, WIX_CUSTOM_LABELS_PATH)

      expect(jsDocRes).to.containSubset({
        services: [
          {
            name: 'Service', memberOf: 'aNamespace',
            operations: [
              {
                name: 'operation',
                docs: {
                  summary: 'an operation'
                },
                extra: {
                  customLabels: [{id: 'maturity-operation'}]
                }
              }
            ]
          }
        ]
      })
    })
  })

  describe('merge', function () {
    it('should detect changed label', function () {
      const repo = runJsDoc(SOURCE_withTag_SERVICE, WIX_CUSTOM_LABELS_PATH)
      const newRepo = runJsDoc(UPDATED_SOURCE_withTag_SERVICE, WIX_CUSTOM_LABELS_PATH)
      const mergeResult = merge(newRepo.services, repo.services, WIX_CUSTOM_LABELS_PATH)

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service operation operation has changed extra.customLabels'])
      expect(mergeResult).to.containSubset({
        repo: [
          {
            name: 'Service', memberOf: 'aNamespace',
            operations: [
              {
                name: 'operation',
                docs: {
                  summary: 'an operation'
                },
                extra: {
                  customLabels: [
                    {id: 'maturity-updated'}
                  ]
                }
              }
            ],
            extra: {
              customLabels: [{id: 'maturity-service-update'}]
            }
          }
        ]
      })
    })
  })

  describe('when a previously custom-labels service becomes not-custom-labels', function () {
    it('should remove custom-labels if tag was removed', function () {
      const repo = runJsDoc(SOURCE_withTag_SERVICE, WIX_CUSTOM_LABELS_PATH)
      const newRepo = runJsDoc(SOURCE_withoutTag_SERVICE, WIX_CUSTOM_LABELS_PATH)
      const mergeResult = merge(newRepo.services, repo.services, WIX_CUSTOM_LABELS_PATH)

      expect(mergeResult.messages).to.containSubset(['Service aNamespace.Service has changed extra.customLabels'])
      expect(mergeResult.repo).to.containSubset([{
        name: 'Service',
        memberOf: 'aNamespace',
        extra: {}
      }
      ])
    })
  })
})
