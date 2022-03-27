const { docworksMergeService, extendDocworksService, SCOPES_TAG_NAME, UNIVERSAL_SCOPES } = require('../src/index')
const { initTestPropertiesAndDefineTags, makeTag } = require('./utils')
describe('wix-scopes', () => {

  it('should register the snippet tag', () => {
    const {dictionary} = initTestPropertiesAndDefineTags()

    expect(dictionary.tags).toHaveProperty(SCOPES_TAG_NAME)
  })

  it('should add scopes value to doclet when tag is added', () => {
    const { dictionary, doclet, tag } = initTestPropertiesAndDefineTags()
    dictionary.tags[SCOPES_TAG_NAME].onTagged(doclet, tag)

    expect(doclet).toEqual(expect.objectContaining({
      scopes: UNIVERSAL_SCOPES
    }))
  })

  it('should extract scopes from doclet', () => {
    const scopes = extendDocworksService({scopes: UNIVERSAL_SCOPES})

    expect(scopes).toEqual(expect.objectContaining({extraValue: UNIVERSAL_SCOPES}))
  })

  describe('merge', () => {
    it('should report no change if no scopes tag', () => {
      const mergeResult = docworksMergeService(undefined, undefined)

      expect(mergeResult.value).not.toBeDefined()
      expect(mergeResult.changed).toBeFalsy()
    })

    it('should report no change if scopes tag did not change', () => {
      const mergeResult = docworksMergeService(true, true)

      expect(mergeResult.value).toEqual(true)
      expect(mergeResult.changed).toBeFalsy()
    })

    it('should report change if scopes tag was added', () => {
      const mergeResult = docworksMergeService(true, undefined)

      expect(mergeResult.value).toEqual(true)
      expect(mergeResult.changed).toBeTruthy()
    })

    it('should report changed if scopes tag was removed', () => {
      const mergeResult = docworksMergeService(undefined, true)

      expect(mergeResult.value).not.toBeDefined()
      expect(mergeResult.changed).toBeTruthy()
    })
  })

  describe('edge cases',() => {
    it('should not accept unknown scope',()=>{
    const { dictionary, doclet } = initTestPropertiesAndDefineTags()
    const tag = makeTag({value: 'unknown_scope'})
    dictionary.tags[SCOPES_TAG_NAME].onTagged(doclet, tag)

    expect(doclet).toEqual(expect.objectContaining({
        scopes: []
      }))
    })
  })
})