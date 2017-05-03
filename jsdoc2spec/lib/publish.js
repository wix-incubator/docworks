var helper = require('jsdoc/util/templateHelper');

exports.publish = function (taffyData, opts) {

    let data = helper.prune(taffyData);
    var members = helper.getMembers(data);

    function find(spec) {
        return helper.find(data, spec);
    }

    data().each(function(doclet) {
       console.log(doclet.longname, doclet.kind);
    });

    var members = helper.getMembers(data);

    members.classes.forEach((aClass) => {
        console.log(aClass.kind, aClass.longname);
        function addMembers(kind) {
            var member = find({kind: kind, memberof: aClass.longname});
            if(member) {
                member.forEach(function(mem) {
                    console.log(mem.kind, mem.longname);
                });
            }
        }
        addMembers('function');
        addMembers('member');
        addMembers('namespace');
        addMembers('typedef');
        addMembers('class');
    })
};