const {defineTags, docworksMergeService, extendDocworksService, SCOPES_TAG_NAME, UNIVERSAL_SCOPES} = require('../src/index')

describe('wix-scopes', function() {

  function makeDict() {
    return {
      tags: {},
      defineTag: function(name, tag) {
        this.tags[name] = tag
      }
    }
  }

  function makeDoclet() {
    return {
      meta: {
        filename: 'source-file.js',
        lineno: '8'
      }
    }
  }

  function makeTag() {
    return {
        originalTitle: 'scopes',
        title: 'scopes',
        text: ''
    }
  }

  it('should register the snippet tag', function() {
    let dictionary = makeDict()

    defineTags(dictionary)

    expect(dictionary.tags).toHaveProperty(SCOPES_TAG_NAME)
  })

  it('should add scopes value to doclet when tag is added', () => {
    const dictionary = makeDict()
    defineTags(dictionary)

    const doclet = makeDoclet()
    const tag = makeTag()
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
})