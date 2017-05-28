import helper from 'jsdoc/util/templateHelper';
import {Service} from 'docworks-model';
import handleProperties from './jsdoc-handler-props';
import handleMessages from './jsdoc-handler-messages';
import handleMixins from './jsdoc-handler-mixins';
import {handleFunctions, handleCallbacks} from './jsdoc-handler-operations';
import {dump} from './util';



//noinspection JSUnusedGlobalSymbols
export function publish(taffyData, opts) {
    opts.serviceModel.clear();

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);
    function find(spec) {
        return helper.find(data, spec);
    }

    const onError = (jsDocError) => opts.serviceModel.addError(jsDocError);

    opts.serviceModel.add(members.classes.map(handleService(find, onError)));
    opts.serviceModel.add(members.namespaces.map(handleService(find, onError)));
    opts.serviceModel.add(members.mixins.map(handleService(find, onError)));
}



function handleService(find, onError) {
    return (service) => {
        let operations = handleFunctions(find, service, onError);
        let properties = handleProperties(find, service, onError);
        let callbacks = handleCallbacks(find, service, onError);
        let messages = handleMessages(find, service, onError);
        let mixes = handleMixins(find, service, onError);
        return Service(service.name, service.memberof, mixes, properties, operations, callbacks, messages);
    }
}

