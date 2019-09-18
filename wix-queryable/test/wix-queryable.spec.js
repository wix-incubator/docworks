const {defineTags, extendDocworksService, docworksMergeService} = require('../src/index')

describe('wix-queryable', function () {

  const makeDict = () => ({
      tags: {},
      defineTag: function (name, tag) {
        this.tags[name] = tag
      }
    }
  )

  const makeDoclet = () => ({
      meta: {
        filename: 'source-file.js',
        lineno: '8'
      }
    }
  )

  const makeTag = () => ({
      originalTitle: 'queryable',
      title: 'queryable',
      text: ''
    }
  )

  test('should register the queryable tag', function () {
    const dictionary = makeDict()

    defineTags(dictionary)

    expect(dictionary.tags).toHaveProperty('queryable')
  })

  test('should add queryable value to doclet when tag is added', function () {
    const dictionary = makeDict()
    defineTags(dictionary)

    const doclet = makeDoclet()
    const tag = makeTag()
    dictionary.tags['queryable'].onTagged(doclet, tag)

    expect(doclet).toEqual(expect.objectContaining({
      queryable: true
    }))
  })

  test('should extract queryable from doclet', function () {
    const queryable = extendDocworksService({queryable: true})
    expect(queryable).toEqual(expect.objectContaining({extraValue: true}))
  })

  describe('merge', function () {
    test('should report no change if no queryable tag', function () {
      const mergeResult = docworksMergeService(undefined, undefined)
      expect(mergeResult.value).not.toBeDefined()
      expect(mergeResult.changed).toBeFalsy()
    })

    test('should report no change if queryable tag did not change', function () {
      const mergeResult = docworksMergeService(true, true)
      expect(mergeResult.value).toEqual(true)
      expect(mergeResult.changed).toBeFalsy()
    })

    test('should report change if queryable tag was added', function () {
      const mergeResult = docworksMergeService(true, undefined)
      expect(mergeResult.value).toEqual(true)
      expect(mergeResult.changed).toBeTruthy()
    })

    test('should report changed if queryable tag was removed', function () {
      const mergeResult = docworksMergeService(undefined, true)
      expect(mergeResult.value).not.toBeDefined()
      expect(mergeResult.changed).toBeTruthy()
    })
  })
})
