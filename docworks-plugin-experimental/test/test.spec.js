const runJsDoc = require('docworks-jsdoc2spec')
const { merge } = require('docworks-repo')

const PLUGIN_PATH = 'src/index'

const EXPERIMENTAL_SOURCE_PATH = 'test/mock-services/ExperimentalMockService.js'
const NON_EXPERIMENTAL_SOURCE_PATH = 'test/mock-services/NonExperimentalMockService.js'

const runJsDocWithPlugin = (sourcePath) =>
  runJsDoc({include: [sourcePath]}, [PLUGIN_PATH])

  const mergeWithPlugin = (updatedRepo, existingRepo) =>
    merge(updatedRepo, existingRepo, [PLUGIN_PATH])


describe('docworks-plugin-experimental', () => {
  describe('setting experimental info', () => {
    it('should add experimental info to a service extra object', () => {
      let jsDocRes = runJsDocWithPlugin(EXPERIMENTAL_SOURCE_PATH)

      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'SampleService',
            memberOf: 'aNamespace',
            extra: {
              experimental: 'ServiceExperiment',
            },
          }),
        ])
      )
    })

    it('should add experimental info to an operation extra object', () => {
      let jsDocRes = runJsDocWithPlugin(EXPERIMENTAL_SOURCE_PATH)

      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'SampleService',
            memberOf: 'aNamespace',
            operations: expect.arrayContaining([
              expect.objectContaining({
                name: 'operation',
                extra: {
                  experimental: 'OperationExperiment',
                },
              })
            ])
          }),
        ])
      )
    })

    it('should add experimental info to a property extra object', () => {
      let jsDocRes = runJsDocWithPlugin(EXPERIMENTAL_SOURCE_PATH)

      expect(jsDocRes.services).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'SampleService',
            memberOf: 'aNamespace',
            properties: expect.arrayContaining([
              expect.objectContaining({
                name: 'property',
                extra: {
                  experimental: 'PropertyExperiment',
                },
              })
            ])
          }),
        ])
      )
    })

    it('should not include experimental info for a service without experiments', () => {
      let jsDocRes = runJsDocWithPlugin(NON_EXPERIMENTAL_SOURCE_PATH)

      expect(JSON.stringify(jsDocRes)).not.toContain('experimental')
    })
  })

  describe('when merging with an existing repo', () => {
    it('should remove experimental info if the service experimental tag is removed', () => {
      let repoWithExperiments = runJsDocWithPlugin(EXPERIMENTAL_SOURCE_PATH)
      let repoWithoutExperiments = runJsDocWithPlugin(NON_EXPERIMENTAL_SOURCE_PATH)

      let mergeResult = mergeWithPlugin(repoWithoutExperiments.services, repoWithExperiments.services)

      expect(mergeResult.messages).toEqual(
        expect.arrayContaining([
          'Service aNamespace.SampleService has changed extra.experimental',
        ])
      )
      expect(JSON.stringify(mergeResult.repo)).not.toContain('experimental')
    })

    it('should add experimental info if the service becomes experimental', () => {
      let repoWithExperiments = runJsDocWithPlugin(EXPERIMENTAL_SOURCE_PATH)
      let repoWithoutExperiments = runJsDocWithPlugin(NON_EXPERIMENTAL_SOURCE_PATH)

      let mergeResult = mergeWithPlugin(repoWithExperiments.services, repoWithoutExperiments.services)

      expect(mergeResult.messages).toEqual(
        expect.arrayContaining([
          'Service aNamespace.SampleService has changed extra.experimental',
        ])
      )
      expect(mergeResult.repo).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'SampleService',
            memberOf: 'aNamespace',
            extra: {
              experimental: 'ServiceExperiment',
            },
            properties: expect.arrayContaining([
              expect.objectContaining({
                name: 'property',
                extra: {
                  experimental: 'PropertyExperiment',
                },
              })
            ]),
            operations: expect.arrayContaining([
              expect.objectContaining({
                name: 'operation',
                extra: {
                  experimental: 'OperationExperiment',
                },
              })
            ])
          }),
        ])
      )
    })
  })
})
