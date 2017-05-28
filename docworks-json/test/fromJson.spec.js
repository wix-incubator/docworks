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

    it('should read json with spec', function() {
        let json = stripMargin(`{
          |  "x": 12,
          |  "y": "abc"
          |}`
        );

        let obj = fromJson(json, {x: {pos:1}, y: {pos:2}});

        expect(obj).to.deep.equal({
            x: 12,
            y: "abc"
        });
    });

    it('should read json with multiline text', function() {
        let json = stripMargin(`{
          |  "x": 12,
          |  "y": "abc",
          |  "text": [
          |    "this is the first line",
          |    "this is the second line"
          |  ]
          |}`
        );

        let obj = fromJson(json, {
            x: {pos:1},
            y: {pos:2},
            text: {pos:3, multiLine:true}
        });

        expect(obj).to.deep.equal({
            x: 12,
            y: "abc",
            text: stripMargin(`this is the first line
            |this is the second line`)
        });
    });

    it('should read nested json with multiline text', function() {
        let json = stripMargin(`{
          |  "x": 12,
          |  "y": "abc",
          |  "z": {  
          |    "text": [
          |      "this is the first line",
          |      "this is the second line"
          |    ]
          |  }
          |}`
        );

        let obj = fromJson(json, {
            x: {pos:1},
            y: {pos:2},
            z: {pos: 3, text: {pos:1, multiLine:true}}
        });

        expect(obj).to.deep.equal({
            x: 12,
            y: "abc",
            z: {text: stripMargin(`this is the first line
                |this is the second line`)
            }
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