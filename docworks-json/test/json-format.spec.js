import chai from 'chai';
const expect = chai.expect;
import {toJson, fromJson} from '../index';
import trimEnd from 'lodash.trimend';


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
        let json = toJson(obj, 2, {a: {pos:1}, b: {pos:2}, r:{pos:3}, x:{pos:4}, z:{pos:5}});
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
        let json = toJson(obj, 2, {z: {pos:1}, a:{pos:2}, r:{pos:3}, b:{pos:4}, x:{pos:5}});
        expect(json).to.equal(stripMargin(`{
          |  z:5,
          |  a:1,
          |  r:3,
          |  b:2,
          |  x:4
          |}`
        ))
    });

    it('should order print all members, even those not in the order array', function() {
        let obj = {
            a: 1,
            z: 5,
            b: 2,
            x: 4,
            r: 3
        };
        let json = toJson(obj, 2, {z:{pos:1}, a:{pos:2}, r:{pos:3}});
        expect(json).to.equal(stripMargin(`{
          |  z:5,
          |  a:1,
          |  r:3,
          |  b:2,
          |  x:4
          |}`
        ))
    });

    it('should support nested objects', function() {
        let obj = {
            a: 1,
            z: 5,
            b: 2,
            x: {
                aa: 1,
                zz: 3,
                cc: 2
            }
        };
        let json = toJson(obj, 2, {
            z: {pos: 1},
            a: {pos: 2},
            x: {pos: 3, aa: {pos: 1}, cc: {pos: 2}, zz: {pos: 3}},
            r: {pos: 4}
        });

        expect(json).to.equal(stripMargin(`{
          |  z:5,
          |  a:1,
          |  x:{
          |    aa:1,
          |    cc:2,
          |    zz:3
          |  },
          |  b:2
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
        .map(trimEnd)
        .join('\n');
}