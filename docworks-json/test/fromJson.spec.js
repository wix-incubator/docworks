import chai from 'chai';
const expect = chai.expect;
import {toJson, fromJson} from '../index';
import trimEnd from 'lodash.trimend';


describe('fromJson', function() {
    it('should read json to an object', function() {
        let json = stripMargin(`{
          |  "x": 12,
          |  "y": "abc"
          |}`
        );

        let obj = fromJson(json);

        expect(obj).to.deep.equal({
            x: 12,
            y: "abc"
        });
    });

    it('should read json to an object', function() {
        let json = stripMargin(`{
          |  "x": 12,
          |  "y": "abc"
          |}`
        );

        let obj = fromJson(json);

        expect(obj).to.deep.equal({
            x: 12,
            y: "abc"
        });
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