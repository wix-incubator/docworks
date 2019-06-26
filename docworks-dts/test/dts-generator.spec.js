import chai from 'chai';
import chaiSubset from 'chai-subset';
import {type as domType, create as domCreate} from 'dts-dom';
import {getDtsType} from '../lib/dts-generator';

chai.use(chaiSubset);
const expect = chai.expect;

describe('generate tern', function() {

    describe('for type', function() {

        it('string', function() {
            expect(getDtsType('string')).to.deep.equal(domType.string);
        });

        it('Array<String>', function() {
            expect(getDtsType({name: 'Array', typeParams: ['string']})).to.equal(domType.array(domType.string));
        });

        it('boolean', function() {
            expect(getDtsType('boolean')).to.equal(domType.boolean);
        });

        it('number', function() {
            expect(getDtsType('number')).to.equal(domType.number);
        });

        it('Object', function() {
            expect(getDtsType('Object')).to.equal(domType.object);
        });

        it('Date', function() {
            expect(getDtsType('Date')).to.equal('Date');
        });

        it('*', function() {
            expect(getDtsType('*')).to.equal(domType.any);
        });

        it('$w.Element', function() {
            expect(getDtsType('$w.Element')).to.equal('$w.Element');
        });

        it('Promise<obj>', function() {
            const expectedValue = domCreate.namedTypeReference(`Promise<object}>`);
            console.log("expectedValueexpectedValue", expectedValue)
            console.log("hjhkj", getDtsType({name: "Promise", typeParams: [ "Object" ]}))
            expect(getDtsType({name: "Promise", typeParams: [ "Object" ]})).to.equal(expectedValue);
        });

        it('Promise<void>', function() {
            const expectedValue = domCreate.namedTypeReference(`Promise<${domType.void}>`);
            expect(getDtsType({name: "Promise", typeParams: [ "void" ]})).to.equal(expectedValue);
        });

        it.only('Promise<[wix_users.User.PricingPlan]>', function() {
            const expectedValue = domCreate.namedTypeReference("Promise<[wix_users.User.PricingPlan]>");
            console.log('expectedValue', expectedValue)
            console.log('gkjhjkhk', getDtsType({ "name": "Promise",
                "typeParams":
                    [ { "name": "Array",
                        "typeParams":
                            [ "wix-users.User.PricingPlan" ] } ] }))
            expect(getDtsType({ "name": "Promise",
                "typeParams":
                    [ { "name": "Array",
                        "typeParams":
                            [ "wix-users.User.PricingPlan" ] } ] })).to.equal(expectedValue);
        });

//    Function
    });

});