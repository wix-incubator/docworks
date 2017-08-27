import chai from 'chai';
import chaiSubset from 'chai-subset';
import runJsDoc from 'docworks-jsdoc2spec';
import {merge, saveToDir} from '../index';
import fs from 'fs-extra';
import {dump} from './util';

chai.use(chaiSubset);
const expect = chai.expect;

function extractServices(path) {
  return runJsDoc({"include": [path],
    "includePattern": ".+\\.(js)?$",}).services;
}

function serviceByName(memberof, name) {
  let noMemberOf = !name;
  name = name?name:memberof;
  return (_) => (_.name === name) && (noMemberOf || _.memberOf === memberof);
}

function memberByName(name) {
  return (_) => (_.name === name);
}

describe('compare repo', function() {

  beforeEach(() => {
    return fs.remove('./tmp');
  });

  it('should report no change if there are no changes and return the repo', async function() {
    let newRepo = extractServices('./test/compare/newVersion/noChange');
    let repo = extractServices('./test/compare/repoVersion/noChange');

    let mergedRepo = merge(newRepo, repo);

    expect(mergedRepo.messages).to.be.empty;
    expect(mergedRepo.repo).to.containSubset(repo);
  });

  it('should report added ServiceB and removed ServiceC', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices');
    let repo = extractServices('./test/compare/repoVersion/changeServices');

    let mergedRepo = merge(newRepo, repo);

    let serviceA = mergedRepo.repo.find(serviceByName('ServiceA'));
    let serviceB = mergedRepo.repo.find(serviceByName('ServiceB'));
    let serviceC = mergedRepo.repo.find(serviceByName('ServiceC'));

    expect(mergedRepo.messages).to.containSubset(['Service ServiceB is new', 'Service ServiceC was removed']);
    expect(serviceA.labels).to.be.empty;
    expect(serviceB.labels).to.include.members(['new']);
    expect(serviceC.labels).to.include.members(['removed']);
  });

  it('should report added package1.ServiceB and removed ServiceB', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeNestedServices');
    let repo = extractServices('./test/compare/repoVersion/changeNestedServices');

    let mergedRepo = merge(newRepo, repo);

    let serviceA = mergedRepo.repo.find(serviceByName('package1', 'ServiceA'));
    let serviceB = mergedRepo.repo.find(serviceByName('ServiceB'));
    let serviceB2 = mergedRepo.repo.find(serviceByName('package1', 'ServiceB'));

    expect(mergedRepo.messages).to.containSubset(['Service package1.ServiceB is new', 'Service ServiceB was removed']);
    expect(serviceA.labels).to.be.empty;
    expect(serviceB.labels).to.include.members(['removed']);
    expect(serviceB2.labels).to.include.members(['new']);
  });

  describe("compare a service", function() {
    let newRepo = extractServices('./test/compare/newVersion/serviceContent');
    let repo = extractServices('./test/compare/repoVersion/serviceContent');

    let mergedRepo = merge(newRepo, repo);

    describe('service attributes', function() {
      it('should detect change in mixes', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceAttributes1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes1 has a new mixes a',
          'Service ChangeServiceAttributes1 mixes b was removed']);

        expect(service.mixes).to.have.members(['a']);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in summary', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceAttributes2'));
        let newService = newRepo.find(serviceByName('ChangeServiceAttributes2'));
        let repoService = repo.find(serviceByName('ChangeServiceAttributes2'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes2 has changed summary']);

        expect(service.docs.summary).to.equal(repoService.docs.summary);
        expect(service.srcDocs.summary).to.equal(newService.srcDocs.summary);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in description', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceAttributes3'));
        let newService = newRepo.find(serviceByName('ChangeServiceAttributes3'));
        let repoService = repo.find(serviceByName('ChangeServiceAttributes3'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes3 has changed description']);

        expect(service.docs.description).to.equal(repoService.docs.description);
        expect(service.srcDocs.description).to.equal(newService.srcDocs.description);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in a link', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceAttributes4'));
        let newService = newRepo.find(serviceByName('ChangeServiceAttributes4'));
        let repoService = repo.find(serviceByName('ChangeServiceAttributes4'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes4 has a new link http://someplace']);

        expect(service.docs.links).to.have.members(repoService.docs.links);
        expect(service.srcDocs.links).to.have.members(newService.srcDocs.links);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in location but not report the service as changed', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceAttributes5'));
        let newService = newRepo.find(serviceByName('ChangeServiceAttributes5'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes5') > -1));

        expect(service.location).to.deep.equal(newService.location);
        expect(service.labels).to.not.include.members(['changed']);
      });
    });

    describe('service properties', function() {
      it('should not report any change if no properties has changed', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServicePropeties1'));
        let newService = newRepo.find(serviceByName('ChangeServicePropeties1'));
        let prop = service.properties.find(memberByName('prop1'));
        let newProp = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServicePropeties1') > -1));

        expect(prop).to.deep.equal(newProp);
      });

      it('should report added and removed properties', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServicePropeties2'));
        let newService = newRepo.find(serviceByName('ChangeServicePropeties2'));
        let repoService = repo.find(serviceByName('ChangeServicePropeties2'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let prop2 = service.properties.find(memberByName('prop2'));
        let newProp1 = newService.properties.find(memberByName('prop1'));
        let repoProp2 = repoService.properties.find(memberByName('prop2'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServicePropeties2 has a new property prop1',
          'Service ChangeServicePropeties2 property prop2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['new']);
        expect(prop1).to.containSubset(newProp1);
        expect(prop2.labels).to.include.members(['removed']);
        expect(prop2).to.containSubset(repoProp2);
      });

      it('should report changed property type', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServicePropeties3'));
        let newService = newRepo.find(serviceByName('ChangeServicePropeties3'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServicePropeties3 property prop1 has changed type']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.type).to.equal(newProp1.type);
      });

      it('should report changed property get/set', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServicePropeties4'));
        let newService = newRepo.find(serviceByName('ChangeServicePropeties4'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServicePropeties4 property prop1 has changed setter']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.get).to.equal(newProp1.get);
        expect(prop1.set).to.equal(newProp1.set);
      });

      it('should report changed property docs', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServicePropeties5'));
        let newService = newRepo.find(serviceByName('ChangeServicePropeties5'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServicePropeties5 property prop1 has changed summary',
          'Service ChangeServicePropeties5 property prop1 has changed description',
          'Service ChangeServicePropeties5 property prop1 has a new link http://new-link',
          'Service ChangeServicePropeties5 property prop1 link http://repo-link was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.srcDocs).to.deep.equal(newProp1.srcDocs);
      })
    });
  });
});
