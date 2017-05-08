import {handleMeta, handleType} from './jsdoc-handler-shared';
import {Operation, Void, JsDocError, Param} from 'swank-model';

export default function handleFunctions(find, service, onError) {
    let functions = find({kind: 'function', memberof: service.longname});
    if (functions) {
        return functions.map((func) => {

            let params = (func.params || []).map((param) => {
                return Param(param.name, handleType(param.type));
            });

            if (func.returns && func.returns.length > 1)
                onError(JsDocError(`Operation ${func.name} has multiple returns annotations`, [handleMeta(func.meta)]));

            let ret = (func.returns && func.returns.length > 0)? handleType(func.returns[0].type): Void;

            // todo handle name params
            return Operation(func.name, [], params, ret);
        });
    }
}
