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
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties1'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties1'));
        let prop = service.properties.find(memberByName('prop1'));
        let newProp = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1));

        expect(prop).to.deep.equal(newProp);
      });

      it('should report added and removed properties', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties2'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties2'));
        let repoService = repo.find(serviceByName('ChangeServiceProperties2'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let prop2 = service.properties.find(memberByName('prop2'));
        let newProp1 = newService.properties.find(memberByName('prop1'));
        let repoProp2 = repoService.properties.find(memberByName('prop2'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties2 has a new property prop1',
          'Service ChangeServiceProperties2 property prop2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['new']);
        expect(prop1).to.containSubset(newProp1);
        expect(prop2.labels).to.include.members(['removed']);
        expect(prop2).to.containSubset(repoProp2);
      });

      it('should report changed property type', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties3'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties3'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties3 property prop1 has changed type']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.type).to.equal(newProp1.type);
      });

      it('should report changed property get/set', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties4'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties4'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties4 property prop1 has changed setter']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.get).to.equal(newProp1.get);
        expect(prop1.set).to.equal(newProp1.set);
      });

      it('should report changed property docs, preserve docs and update srcDocs', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties5'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties5'));
        let repoService = repo.find(serviceByName('ChangeServiceProperties5'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));
        let repoProp1 = repoService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties5 property prop1 has changed summary',
          'Service ChangeServiceProperties5 property prop1 has changed description',
          'Service ChangeServiceProperties5 property prop1 has a new link http://new-link',
          'Service ChangeServiceProperties5 property prop1 link http://repo-link was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.srcDocs).to.deep.equal(newProp1.srcDocs);
        expect(prop1.src).to.deep.equal(repoProp1.src);
      });

      it('should detect change in property location but not report the service or property as changed', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceProperties6'));
        let newService = newRepo.find(serviceByName('ChangeServiceProperties6'));
        let prop1 = service.properties.find(memberByName('prop1'));
        let newProp1 = newService.properties.find(memberByName('prop1'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1));

        expect(service.labels).to.not.include.members(['changed']);
        expect(prop1.labels).to.not.include.members(['changed']);
        expect(prop1.locations).to.deep.equal(newProp1.locations);
      })
    });

    describe('service operations', function() {
      it('should not report any change if no operations has changed', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations1'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations1'));
        let operation = service.operations.find(memberByName('operations1'));
        let newOperation = newService.operations.find(memberByName('operations1'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1));

        expect(operation).to.containSubset(newOperation);
      });

      it('should report added and removed operations', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations2'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations2'));
        let repoService = repo.find(serviceByName('ChangeServiceOperations2'));
        let operation3 = service.operations.find(memberByName('operation3'));
        let operation2 = service.operations.find(memberByName('operation2'));
        let newOperation3 = newService.operations.find(memberByName('operation3'));
        let repoOperation2 = repoService.operations.find(memberByName('operation2'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations2 has a new operation operation3',
          'Service ChangeServiceOperations2 operation operation2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation3.labels).to.include.members(['new']);
        expect(operation3).to.containSubset(newOperation3);
        expect(operation2.labels).to.include.members(['removed']);
        expect(operation2).to.containSubset(repoOperation2);
      });

      it('should report changes in param type', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation1 = service.operations.find(memberByName('operation1'));
        let newOperation1 = newService.operations.find(memberByName('operation1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation1 has changed type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation1.labels).to.include.members(['changed']);
        operation1.params.forEach((param, index) => {
          let newParam = newOperation1.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should report changes in param name', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation2 = service.operations.find(memberByName('operation2'));
        let newOperation2 = newService.operations.find(memberByName('operation2'));

        expect(mergedRepo.messages).to.containSubset([
          'Service ChangeServiceOperations3 operation operation2 has changed param name from input to anotherInput']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation2.labels).to.include.members(['changed']);
        operation2.params.forEach((param, index) => {
          let newParam = newOperation2.params[index];
          expect(param.name).to.equal(newParam.name);
        })
      });

      it('should report changes in param doc', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let repoService = repo.find(serviceByName('ChangeServiceOperations3'));
        let operation3 = service.operations.find(memberByName('operation3'));
        let newOperation3 = newService.operations.find(memberByName('operation3'));
        let repoOperation3 = repoService.operations.find(memberByName('operation3'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation3 has changed doc']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation3.labels).to.include.members(['changed']);
        operation3.params.forEach((param, index) => {
          let newParam = newOperation3.params[index];
          let repoParam = repoOperation3.params[index];
          expect(param.doc).to.equal(repoParam.doc);
          expect(param.srcDoc).to.equal(newParam.srcDoc);
        })
      });

      it('should report new params', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let repoService = repo.find(serviceByName('ChangeServiceOperations3'));
        let operation4 = service.operations.find(memberByName('operation4'));
        let newOperation4 = newService.operations.find(memberByName('operation4'));
        let repoOperation4 = repoService.operations.find(memberByName('operation4'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation4 has a new param input2']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation4.labels).to.include.members(['changed']);

        for (let i = repoOperation4.params.length; i < newOperation4.params.length; i++) {
          let newParam = newOperation4.params[i];
          let param = operation4.params[i];
          expect(param).to.containSubset(newParam);
        }

      });

      it('should report removed params', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation5 = service.operations.find(memberByName('operation5'));
        let newOperation5 = newService.operations.find(memberByName('operation5'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation5 param input2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation5.labels).to.include.members(['changed']);
        expect(operation5.params.length).to.equal(newOperation5.params.length);

      });

      it('should report changes in complex param type', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation6 = service.operations.find(memberByName('operation6'));
        let newOperation6 = newService.operations.find(memberByName('operation6'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation6 has changed type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation6.labels).to.include.members(['changed']);
        operation6.params.forEach((param, index) => {
          let newParam = newOperation6.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should not report any change if no operations has changed - for complex typed', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation = service.operations.find(memberByName('operations7'));
        let newOperation = newService.operations.find(memberByName('operations7'));

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('operation7') > -1));

        expect(operation).to.containSubset(newOperation);
      });

      it('should report changed property docs, preserve docs and update srcDocs', function() {
        let service = mergedRepo.repo.find(serviceByName('ChangeServiceOperations4'));
        let newService = newRepo.find(serviceByName('ChangeServiceOperations4'));
        let repoService = repo.find(serviceByName('ChangeServiceOperations4'));
        let operation = service.operations.find(memberByName('operation1'));
        let newOperation = newService.operations.find(memberByName('operation1'));
        let repoOperation = repoService.operations.find(memberByName('operation1'));

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations4 operation operation1 has changed summary',
          'Service ChangeServiceOperations4 operation operation1 has changed description']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation.labels).to.include.members(['changed']);
        expect(operation.srcDocs).to.deep.equal(newOperation.srcDocs);
        expect(operation.src).to.deep.equal(repoOperation.src);
      });

      // operation location
    });
  });
});
