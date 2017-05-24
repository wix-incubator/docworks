import {JsDocError} from 'swank-model';
import {handleMeta} from './jsdoc-handler-shared';

const validateMixes = (find, service, onError) => (mixes) => {
    let mixesByFullPath = find({longname: mixes});
    let mixesByRelativePath = find({name: mixes})
        .filter((aMixes) => aMixes.memberof === service.memberof);
    var location = handleMeta(service.meta);

    if (mixesByFullPath.length === 0 && mixesByRelativePath.length === 0)
        onError(JsDocError(`Mixin ${mixes} not found`, [location]));
    if (mixesByRelativePath.length)
        return `${service.memberof}.${mixes}`;
    else
        return mixes;
};

export default function handleMixins(find, service, onError) {
    let mixes = service.mixes;
    if(!mixes)
        return [];

    return mixes.map(validateMixes(find, service, onError));
}


