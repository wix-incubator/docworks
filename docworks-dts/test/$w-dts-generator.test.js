const {readFromDir} = require('docworks-repo')
const {createDollarWDTS} = require('../lib/$w-dts-generator')
const ts = require('typescript')

describe('$w-dts-generator - DTS generator for "$w" auto-completion', () => {
  // used in offline corvid code editor Date()

  describe('Creating the $w.d.ts file content', () => {
    test('create $w.d.ts file content with $w namespace', async () => {
      const {services} = await readFromDir('./test/services')
      const dollarWDTS = createDollarWDTS(services)
      expect(dollarWDTS).toMatch(/declare namespace \$w \{[.\s\S]*}[\s\S]*/)
    })

    describe('create $w selector functions', () => {
      test('the selectors for nickname/alias', async () => {
        const {services} = await readFromDir('./test/services')
        const dollarWDTS = createDollarWDTS(services)
        expect(dollarWDTS).toContain('type WixElementSelector = PageElementsMap & IntersectionArrayAndBase<TypeNameToSdkType>')
      })

      test('the selectors for type and page elements', async () => {
        const {services} = await readFromDir('./test/services')
        const dollarWDTS = createDollarWDTS(services)
        expect(dollarWDTS).toContain('declare function $w<T extends keyof WixElementSelector>(selector: T): WixElementSelector[T]')
      })
    })

    describe('create query-able element type map', () => {
      test('should create the map', async () => {
        const {services} = await readFromDir('./test/services')
        const dollarWDTS = createDollarWDTS(services)
        expect(dollarWDTS).toMatch(/type TypeNameToSdkType = \{[.\s\S]*\}/)
      })
    })

    describe('TypeNameToSdkType', () => {

      const getTypeAlias = (dts, typeName) => {
        const typeNameToSdkType = dts.statements.find(node => node.name.text === typeName)
        return typeNameToSdkType.type.members.map(entry => ({
          name: entry.name.text,
          value: entry.type.typeName.left.text + '.' + entry.type.typeName.right.text
        }))
      }

      test('should have the queriables in it', async () => {
        const { services } = await readFromDir('./test/services')
        const queriables = [
          {
            name: 'Amit',
            memberOf: 'Wix'
          }, {
            name: 'Nir',
            memberOf: '$w'
          }
        ]
        const dollarWDTS = createDollarWDTS(services, queriables)
        const parsedDts = ts.createSourceFile('inline.d.ts', dollarWDTS, ts.ScriptTarget.ES2015, false, ts.ScriptKind.TS)

        expect(getTypeAlias(parsedDts, 'TypeNameToSdkType')).toEqual([
          { name: 'Amit', value: 'Wix.Amit' },
          { name:'Nir', value: '$w.Nir' },
        ])
      })
    })
  })
})
