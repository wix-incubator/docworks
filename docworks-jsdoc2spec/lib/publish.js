const helper = require('jsdoc/util/templateHelper')
const {Service} = require('docworks-model')
const handleProperties = require('./jsdoc-handler-props')
const handleMessages = require('./jsdoc-handler-messages')
const handleMixins = require('./jsdoc-handler-mixins')
const handlePlugins = require('./docworks-plugins')
const {handleFunctions, handleCallbacks} = require('./jsdoc-handler-operations')
const {handleMeta, handleDoc, handleTags, handleExtra} = require('./jsdoc-handler-shared')


function loadPlugins(plugins) {
  return (plugins || []).map(require)
}


//noinspection JSUnusedGlobalSymbols
function publish(taffyData, opts) {
  opts.serviceModel.clear()

  let data = helper.prune(taffyData)
  let members = helper.getMembers(data)
  function find(spec) {
    return helper.find(data, spec)
  }

  const plugins = loadPlugins(opts.plugins)
  const onError = (jsDocError) => opts.serviceModel.addError(jsDocError)

  opts.serviceModel.add(members.classes.map(handleService(find, onError, plugins)))
  opts.serviceModel.add(members.namespaces.map(handleService(find, onError, plugins)))
  opts.serviceModel.add(members.mixins.map(handleService(find, onError, plugins)))
}



function handleService(find, onError, plugins) {
  return (serviceDoclet) => {
    let operations = handleFunctions(find, serviceDoclet, onError, plugins)
    let properties = handleProperties(find, serviceDoclet, onError, plugins)
    let callbacks = handleCallbacks(find, serviceDoclet, onError, plugins)
    let messages = handleMessages(find, serviceDoclet, onError, plugins)
    let mixes = handleMixins(find, serviceDoclet, onError)
    let location = handleMeta(serviceDoclet.meta)
    let docs = handleDoc(serviceDoclet, plugins)
    let extra = handleExtra(serviceDoclet)

    let service = Service(serviceDoclet.name, serviceDoclet.memberof, mixes, [], properties, operations, callbacks, messages, location, docs, extra)
    return handlePlugins(plugins, 'extendDocworksService', serviceDoclet, service)
  }
}


module.exports = {
  publish
}
