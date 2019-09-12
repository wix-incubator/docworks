const runJsDoc = require('docworks-jsdoc2spec')
const dts = require('../../lib')
const fs = require('fs-extra')
const { readFromDir } = require('docworks-repo')
const path = require('path')
const uuid = require('uuid')

const prepareDts = async () => {
  const jsSpecs = runJsDoc({
    'include': fs.readdirSync(path.resolve(__dirname, './services')).map(filename => `test/e2e/services/${filename}`)
  })

  const tempDir = path.resolve('/var/tmp', uuid.v4())
  fs.ensureDirSync(tempDir)
  jsSpecs.services.forEach(service => {
    fs.writeJSONSync(path.resolve(tempDir, `${service.name}.service.json`), service)
  })
  const fromDir = await readFromDir(tempDir)

  return dts(fromDir.services)
}

describe('queriable', () => {
  let dtsOutput

  beforeEach(async () => {
    dtsOutput = await prepareDts()
  })

  describe('$w.d.ts', () => {
    it('contains the QueriableService', () => {
      expect(dtsOutput.dollarWDTS.join('\n')).toContain('"QueriableService": aNamespace.QueriableService')
    })
    
    it('does not contain the NonQueriableService', () => {
      expect(dtsOutput.dollarWDTS.join('\n')).not.toContain('NonQueriableService')
    })
  })
})