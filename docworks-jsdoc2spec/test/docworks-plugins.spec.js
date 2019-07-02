import runJsDoc from '../lib/jsdoc-runner'
import chai from 'chai'
import chaiSubset from 'chai-subset'
const expect = chai.expect
chai.use(chaiSubset)

describe('docworks plugins', function() {
  it('run with plugin', function() {
    let jsDocRes = runJsDoc({
      'include': [
        'test/service-plugin.js'
      ],
    }, ['./test/docworks-plugin'])

    expect(jsDocRes).to.containSubset({
      services: [
        {name: 'Service', memberOf: 'aNamespace',
          operations: [
            { name: 'operation',
              extra: {pluginGenerated: 'operation plugin visited'},
              docs: {
                summary: 'plugin updated summary',
                examples: [
                  {title: 'name', body: 'plugin updated body', extra: {pluginGenerated: 'example plugin visited'}}],
                extra: {pluginGenerated: 'docs plugin visited'}}}
          ],
          properties: [
            { name: 'label',
              extra: {pluginGenerated: 'property plugin visited'},
              docs: {
                examples: [
                  {title: 'name', body: 'plugin updated body', extra: {pluginGenerated: 'example plugin visited'}}],
                extra: {pluginGenerated: 'docs plugin visited'}}}
          ],
          messages: [
            { name: 'InMessage',
              extra: {pluginGenerated: 'message plugin visited'},
              docs: {
                examples: [
                  {title: 'name', body: 'plugin updated body', extra: {pluginGenerated: 'example plugin visited'}}],
                extra: {pluginGenerated: 'docs plugin visited'}}}
          ],
          extra: {pluginGenerated: 'service plugin visited'},
          docs: {
            examples: [
              {title: 'name', body: 'plugin updated body', extra: {pluginGenerated: 'example plugin visited'}}],
            extra: {pluginGenerated: 'docs plugin visited'}}
        }
      ]
    })

  })
})
