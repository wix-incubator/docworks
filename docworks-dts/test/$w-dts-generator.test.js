const {readFromDir} = require('docworks-repo')
const {createDollarWDTS} = require('../lib/$w-dts-generator')
const ts = require('typescript')

describe('$w-dts-generator - DTS generator for "$w" auto-completion', () => {
  // used in offline corvid code editor Date()

	const get$wDTS = async ({
		services,
		queriables
	} = {}) => {
		if (!services) {
			const fromDir = await readFromDir('./test/services')
			services = fromDir.services
		}

		return createDollarWDTS(services, queriables)
	}

  describe('Creating the $w.d.ts file content', () => {
    test('create $w.d.ts file content with $w namespace', async () => {
			const dollarWDTS = await get$wDTS()
      expect(dollarWDTS).toMatch(/declare namespace \$w \{[.\s\S]*}[\s\S]*/)
    })

    describe('create $w selector functions', () => {
      test('the selectors for nickname/alias', async () => {
				const dollarWDTS = await get$wDTS()
        expect(dollarWDTS).toContain('type WixElementSelector = PageElementsMap & IntersectionArrayAndBase<TypeNameToSdkType>')
      })

      test('the selectors for type and page elements', async () => {
				const dollarWDTS = await get$wDTS()
        expect(dollarWDTS).toContain('declare function $w<T extends keyof WixElementSelector>(selector: T): WixElementSelector[T]')
      })
    })

    describe('create query-able element type map', () => {
      test('should create the map', async () => {
				const dollarWDTS = await get$wDTS()
        expect(dollarWDTS).toMatch(/type TypeNameToSdkType = \{[.\s\S]*\}/)
      })
		})

    describe('TypeNameToSdkType', () => {
      test('should have the queriables in it', async () => {
        const queriables = [
          {
            name: 'Amit',
            memberOf: 'Wix'
          }, {
            name: 'Nir',
            memberOf: '$w'
          }
				]
				const dollarWDTS = await get$wDTS({ queriables })
				
        const parsedDts = ts.createSourceFile('inline.d.ts', dollarWDTS, ts.ScriptTarget.ES2015, false, ts.ScriptKind.TS)
        const typeNameToSdkType = parsedDts.statements.find(node => node.name.text === 'TypeNameToSdkType')

        const expectedDts = `
type TypeNameToSdkType = {
	"Amit": Wix.Amit,
	"Nir": $w.Nir
}
`
        expect(typeNameToSdkType.getText(parsedDts)).toEqual(expectedDts.trim())
      })
    })
  })
})
