import chai from 'chai';
import chaiSubset from 'chai-subset';
import runJsDoc from 'docworks-jsdoc2spec';
import {merge} from '../index';
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

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes1 has new mixes a',
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
    });
  });
});
