import chai from 'chai';
const expect = chai.expect;
import {toJson, fromJson} from '../index';


describe('toJson', function() {
    it('should write object to json', function() {
        let obj = {
            x: 12,
            y: "abc"
        };
        let json = toJson(obj, 2);
        expect(json).to.equal(stripMargin(`{
          |  x:12,
          |  y:"abc"
          |}`
        ))
    });

    it('should order the object by the spec object', function() {
        let obj = {
            a: 1,
            z: 5,
            b: 2,
            x: 4,
            r: 3
        };
        let json = toJson(obj, 2, {order: ['a', 'b', 'r', 'x', 'z']});
        expect(json).to.equal(stripMargin(`{
          |  a:1,
          |  b:2,
          |  r:3,
          |  x:4,
          |  z:5
          |}`
        ))
    });

    it('should order the object by the spec object regardless of natural sort', function() {
        let obj = {
            a: 1,
            z: 5,
            b: 2,
            x: 4,
            r: 3
        };
        let json = toJson(obj, 2, {order: ['z', 'a', 'r', 'b', 'x']});
        expect(json).to.equal(stripMargin(`{
          |  z:5,
          |  a:1,
          |  r:3,
          |  b:2,
          |  x:4
          |}`
        ))
    });
});

function stripMargin(string) {
    return string.split('\n')
        .map(line => {
            let parts = line.split('|');
            return (parts.length == 2)?parts[1]: parts[0]
        })
        .join('\n');
}