const { docworksMergeService, extendDocworksService, SCOPES_TAG_NAME, UNIVERSAL_SCOPES } = require('../src/index')
const { ScopeErrorKinds } = require('../src/ScopeErrors')
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

    let dictionary,doclet,spy

    beforeEach(()=>{
        const testProperties = initTestPropertiesAndDefineTags()
        dictionary = testProperties.dictionary
        doclet = testProperties.doclet
        spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should not accept invalid scopes pattern',()=>{
        const tag = makeTag({value: 'frontend,backend'})
        dictionary.tags[SCOPES_TAG_NAME].onTagged(doclet, tag)
        
        expect(doclet).toEqual(expect.objectContaining({
            scopes: []
        }))

        expect(spy).toHaveBeenCalledWith(
            expect.anything(),
            ScopeErrorKinds.INVALID_SCOPES_SCHEMA
        )
    })

    it('should not accept unknown scope',()=>{
        const tag = makeTag({value: '[unknownScope]'})
        dictionary.tags[SCOPES_TAG_NAME].onTagged(doclet, tag)

        expect(doclet).toEqual(expect.objectContaining({
            scopes: []
        }))
        
        expect(spy).toHaveBeenCalledWith(
            expect.anything(),
            ScopeErrorKinds.INVALID_SCOPE
        )
    })

    it('should not accept empty scopes value',()=>{
        const tag = makeTag({value: '[]'})
        dictionary.tags[SCOPES_TAG_NAME].onTagged(doclet, tag)

        expect(doclet).toEqual(expect.objectContaining({
            scopes: []
        }))
        
        expect(spy).toHaveBeenCalledWith(
            expect.anything(),
            ScopeErrorKinds.EMPTY_SCOPES
        )
     })
    })
})