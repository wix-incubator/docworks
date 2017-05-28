import {handleMeta, handleType, typeContext} from './jsdoc-handler-shared';
import {Message, MessageMember, JsDocError} from 'docworks-model';
import {dump} from './util';

const groupByName = (groups, message) => {
    if (!message)
        return groups;
    if (groups[message.name])
        groups[message.name].push(message);
    else
        groups[message.name] = [message];
    return groups;
};

const handleProp = (find, onError, context) => (prop) => {
    return MessageMember(prop.name,
        handleType(prop.type, find, onError, context)
    );
};

const processMessages = (find, onError) => (messages) => {
    if (messages.length > 0) {
        let message = messages[0];
        let members = (message.properties || [])
            .map(handleProp(find, onError, typeContext('Message', message.name, 'property', message.memberof, handleMeta(message.meta))));

        if (messages.length > 1)
            onError(JsDocError(`Message ${message.name} is defined two or more times`, messages.map(mes => handleMeta(mes.meta))));

        return Message(message.name, members);
    }
};

export default function handleMessages(find, service, onError) {
    let typedefs = find({kind: 'typedef', memberof: service.longname});
    if (!typedefs)
        return [];

    let callbacks = typedefs.filter((_) => !(_.type && _.type.names && _.type.names[0] === 'function'));

    let groups = callbacks.reduce(groupByName, {});
    return Object.keys(groups)
        .map((group) => groups[group])
        .map(processMessages(find, onError));

}
