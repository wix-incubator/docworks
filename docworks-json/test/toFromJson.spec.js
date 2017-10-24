import chai from 'chai';
const expect = chai.expect;
import {toJson, fromJson} from '../src/index';
import {stripMargin} from './util';

describe('to and from Json', function() {

    it('should write and read the same object', function() {
        let obj = {
            a: 1,
            z: 5,
            text: stripMargin(`this is the first line
            |this is the second line`)
        };
        var spec = {
            z: {pos: 1},
            a: {pos: 2},
            text: {pos: 3, multiLine:true}
        };
        let json = toJson(obj, 2, spec);
        let obj2 = fromJson(json, spec);

        expect(obj2).to.deep.equal(obj);
    });
});
