import chai from 'chai';
import chaiSubset from 'chai-subset';
const expect = chai.expect;
chai.use(chaiSubset);

import {defineTags} from '../src/index';

describe('wix-note', function() {

  function makeDict() {
    return {
      tags: {},
      defineTag: function(name, tag) {
        this.tags[name] = tag;
      }
    }
  }

  it('should register the snippet tag', function() {
    let dictionary = makeDict();

    defineTags(dictionary);

    expect(dictionary.tags).to.have.key('note');
  });

  function makeDoclet() {
    return {
      meta: {
        filename: 'source-file.js',
        lineno: '8'
      }
    }
  }

  function makeTag() {
    return {
      originalTitle: 'note',
      title: 'note',
      text: 'this is a note',
      value: 'this is a note'
    }
  }


  it.only('should copy note from tag to doclet', function() {
    let dictionary = makeDict();
    defineTags(dictionary);

    let doclet = makeDoclet();
    let tag = makeTag();
    dictionary.tags['note'].onTagged(doclet, tag);

    expect(doclet).to.containSubset({
      notes:
        ['this is a note']
    });
  });

});