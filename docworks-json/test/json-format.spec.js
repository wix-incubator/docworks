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
   })
});

function stripMargin(string) {
    return string.split('\n')
        .map(line => {
            let parts = line.split('|');
            return (parts.length == 2)?parts[1]: parts[0]
        })
        .join('\n');
}