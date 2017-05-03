var helper = require('jsdoc/util/templateHelper');

exports.publish = function (taffyData, opts) {

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);

    function find(spec) {
        return helper.find(data, spec);
    }

    members.classes.forEach(handleService(find));
};

function handleService(find) {
    return (service) => {
        console.log('service', service.kind, service.longname);
        handleMembers(find)(service, 'function');
        handleMembers(find)(service, 'member');
        handleMembers(find)(service, 'namespace');
        handleMembers(find)(service, 'typedef');
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