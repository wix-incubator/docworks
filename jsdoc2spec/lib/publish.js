import helper from 'jsdoc/util/templateHelper';
import {Service, Operation, Param, Property} from 'swank-model';

export function publish (taffyData, opts) {

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);

    function find(spec) {
        return helper.find(data, spec);
    }

    members.classes.forEach(handleService(find));
}

function handleService(find) {
    return (service) => {
        console.log('service', service.kind, service.longname);
        handleMembers(find)(service, 'function');
        let properties = handleProperties(find, service);
        handleMembers(find)(service, 'namespace');
        handleMembers(find)(service, 'typedef');
        console.log(properties);
    }
}

function handleMembers(find) {
    return (service, kind) => {
        var members = find({kind: kind, memberof: service.longname});
        if(members) {
            members.forEach(function(mem) {
                console.log('member', mem.kind, mem.longname);
            });
        }
    }
}

function handleProperties(find, service) {
    let members = find({kind: 'member', memberof: service.longname});
    if(members) {
        return members.map((member) => {
            return Property(member.name, true, true, member.type);
        });
    }
    else
        return [];
}