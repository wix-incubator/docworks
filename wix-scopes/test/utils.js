const { defineTags } = require('../src/index')

const makeDict = () => {
    return {
      tags: {},
      defineTag: function(name, tag) {
        this.tags[name] = tag
      }
    }
  }

  const makeDoclet = () => {
    return {
      meta: {
        filename: 'source-file.js',
        lineno: '8'
      }
    }
  }

  const makeTag = (options = {}) => {
    return {
        originalTitle: 'scopes',
        title: 'scopes',
        text: '',
        ...options
    }
  }

  const initTestProperties = () =>{
    const dictionary = makeDict()
    const doclet = makeDoclet()
    const tag = makeTag()

    return {dictionary, doclet, tag}
  }

  const initTestPropertiesAndDefineTags = () =>{
    const {dictionary, doclet, tag} = initTestProperties()
    defineTags(dictionary)

    return {dictionary, doclet, tag}
  }

  module.exports = {
      makeDict,
      makeDoclet,
      makeTag,
      initTestProperties,
      initTestPropertiesAndDefineTags
  }