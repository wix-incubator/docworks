import helper from 'jsdoc/util/templateHelper';
import {Service} from 'swank-model';
import handleProperties from './jsdoc-handler-props';
import handleMessages from './jsdoc-handler-messages';
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
}



function handleService(find, onError) {
    return (service) => {
        let operations = handleFunctions(find, service, onError);
        let properties = handleProperties(find, service, onError);
        let callbacks = handleCallbacks(find, service, onError);
        let messages = handleMessages(find, service, onError);
        handleMembers(find)(service, 'namespace');
        return Service(service.name, properties, operations, callbacks, messages);
    }
}

function handleMembers(find) {
    return (service, kind) => {
        var members = find({kind: kind, memberof: service.longname});
        if(members) {
            members.forEach(function(mem) {
                console.log('member', mem.kind, mem.longname);
                // dump(mem);
            });
        }
    }
}

