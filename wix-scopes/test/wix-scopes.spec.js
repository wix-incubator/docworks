const { docworksMergeService, extendDocworksService, SCOPES_TAG_NAME, UNIVERSAL_SCOPES, BACKEND_SCOPE, FRONTEND_SCOPE } = require('../src/index')
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

    it('should merge scopes tag properly', () => {
        const mergeResult = docworksMergeService([BACKEND_SCOPE], [FRONTEND_SCOPE])
    
        expect(mergeResult.value).toEqual(UNIVERSAL_SCOPES)
        expect(mergeResult.changed).toBeTruthy()
    })

    it('should merge new value scope tag properly', () => {
        const mergeResult = docworksMergeService(undefined, [BACKEND_SCOPE])
  
        expect(mergeResult.value).toEqual([BACKEND_SCOPE])
        expect(mergeResult.changed).toBeTruthy()
    })

    it('should merge old value scope tag properly', () => {
        const mergeResult = docworksMergeService([FRONTEND_SCOPE], undefined)
  
        expect(mergeResult.value).toEqual([FRONTEND_SCOPE])
        expect(mergeResult.changed).toBeTruthy()
    })

    it('should merge scopes tag properly and not contain duplicates', () => {
        const mergeResult = docworksMergeService([BACKEND_SCOPE,FRONTEND_SCOPE], [FRONTEND_SCOPE])

        expect(mergeResult.value).toEqual(UNIVERSAL_SCOPES)
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