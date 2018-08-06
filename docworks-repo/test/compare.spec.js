import chai from 'chai';
import chaiSubset from 'chai-subset';
import runJsDoc from 'docworks-jsdoc2spec';
import {merge, saveToDir} from '../lib/index';
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

function repoServiceProp(baseRepo, serviceName, propName) {
  let repo = baseRepo.filter(_ => _.name === serviceName);
  let service = repo.find(serviceByName(serviceName));
  let prop = service.properties.find(memberByName(propName));
  return {repo, service, prop};
}

function repoServiceOperation(baseRepo, serviceName, operationName) {
  let repo = baseRepo.filter(_ => _.name === serviceName);
  let service = repo.find(serviceByName(serviceName));
  let operation = service.operations.find(memberByName(operationName));
  return {repo, service, operation};
}

function repoServiceCallback(baseRepo, serviceName, operationName) {
  let repo = baseRepo.filter(_ => _.name === serviceName);
  let service = repo.find(serviceByName(serviceName));
  let callback = service.callbacks.find(memberByName(operationName));
  return {repo, service, callback};
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

  it('should remove the removed label from a re-added service', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices');
    let repo = extractServices('./test/compare/repoVersion/changeServices');
    // simulate existing service that is marked as removed
    let repoServiceA = repo.find(serviceByName('ServiceA'));
    repoServiceA.labels = ['removed'];

    let mergedRepo = merge(newRepo, repo);

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceA'));

    expect(serviceB.labels).to.not.include.members(['removed']);
  });

  it('should remove the changed label if a service did not change', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices');
    let repo = extractServices('./test/compare/repoVersion/changeServices');
    // simulate existing service that is marked as changed
    let repoServiceA = repo.find(serviceByName('ServiceA'));
    repoServiceA.labels = ['changed'];

    let mergedRepo = merge(newRepo, repo);

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceA'));

    expect(serviceB.labels).to.not.include.members(['changed']);
  });

  it('should remove the new label from a new service that is removed', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices');
    let repo = extractServices('./test/compare/repoVersion/changeServices');
    // simulate existing serviceC as new
    let repoServiceC = repo.find(serviceByName('ServiceC'));
    repoServiceC.labels = ['new'];

    let mergedRepo = merge(newRepo, repo);

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceC'));

    expect(serviceB.labels).to.include.members(['removed']);
    expect(serviceB.labels).to.not.include.members(['new']);
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
    let baseNewRepo, baseRepo, defaultMergedRepo;
    beforeEach(() => {
      baseNewRepo = extractServices('./test/compare/newVersion/serviceContent');
      baseRepo = extractServices('./test/compare/repoVersion/serviceContent');

      defaultMergedRepo = merge(baseNewRepo, baseRepo);
    });

    describe('service attributes', function() {
      it('should detect change in mixes', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceAttributes1'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes1 has a new mixes a',
          'Service ChangeServiceAttributes1 mixes b was removed']);

        expect(service.mixes).to.have.members(['a']);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in summary', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceAttributes2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes2'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes2'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes2 has changed summary']);

        expect(service.docs.summary).to.equal(repoService.docs.summary);
        expect(service.srcDocs.summary).to.equal(newService.srcDocs.summary);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in description', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceAttributes3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes3'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes3'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes3 has changed description']);

        expect(service.docs.description).to.equal(repoService.docs.description);
        expect(service.srcDocs.description).to.equal(newService.srcDocs.description);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in a link', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceAttributes4'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes4'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes4'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes4 has a new link http://someplace']);

        expect(service.docs.links).to.have.members(repoService.docs.links);
        expect(service.srcDocs.links).to.have.members(newService.srcDocs.links);
        expect(service.labels).to.include.members(['changed']);
      });

      it('should detect change in location but not report the service has changed', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceAttributes5'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes5'));

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes5') > -1));

        expect(service.location).to.deep.equal(newService.location);
        expect(service.labels).to.not.include.members(['changed']);
      });

      it('should update extra but not report the service has changed', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'));
        repoService.extra = {me: 'old'};
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'));
        newService.extra = {me: 'new'};

        let customMergedRepo = merge(baseNewRepo, baseRepo);

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1));

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'));
        expect(service.extra).to.deep.equal(newService.extra);
        expect(service.labels).to.not.include.members(['changed']);
      });

      it('should detect change in extra and let plugin control the merge', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'));
        repoService.extra = {thePlugin: 'old'};
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'));
        newService.extra = {thePlugin: 'new'};

        let customMergedRepo = merge(baseNewRepo, baseRepo, ['../test/plugin']);

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes6 has changed extra.thePlugin']);

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'));
        expect(service.extra).to.deep.equal(newService.extra);
        expect(service.labels).to.include.members(['changed']);
      });
    });

    describe('service properties', function() {
      it('should not report any change if no properties has changed', function() {
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');

        let mergedRepo = merge(newRepo, repo);
        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1));

        let {prop: prop} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(prop).to.deep.equal(newProp);
      });

      it('should report added and removed properties', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop1');
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2');

        let mergedRepo = merge(newRepo, repo);
        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties2 has a new property prop1',
          'Service ChangeServiceProperties2 property prop2 was removed']);

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop1');
        let {prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2');
        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['new']);
        expect(prop1).to.containSubset(newProp1);
        expect(prop2.labels).to.include.members(['removed']);
        expect(prop2).to.containSubset(repoProp2);
      });
      
      it('should not report removed properties if they have the removed label', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop1');
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2');
        // simulate a property as marked as removed
        repoProp2.labels.push('removed');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties2 property prop2 was removed') > -1));

        let {service, prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2');
        expect(service.labels).to.include.members(['changed']);
        expect(prop2.labels).to.include.members(['removed']);
        expect(prop2).to.containSubset(repoProp2);
      });

      it('should remove the removed label from re-added props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        // simulate a property as marked as removed
        repoProp1.labels.push('removed');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1 was removed') > -1));

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(service.labels).to.not.include.members(['changed']);
        expect(prop1.labels).to.include.members(['new']);
        expect(prop1.labels).to.not.include.members(['removed']);
      });

      it('should remove the new label from removed props, and mark service as changed', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop2');
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2');
        // simulate a property as a new prop
        repoProp2.labels.push('new');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties2 property prop2 was removed']);

        let {service, prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2');
        expect(service.labels).to.include.members(['changed']);
        expect(prop2.labels).to.not.include.members(['new']);
        expect(prop2.labels).to.include.members(['removed']);
      });

      it('should remove the new label from existing props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        // simulate a property as marked as new
        repoProp1.labels.push('new');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1') > -1));

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(service.labels).to.not.include.members(['changed']);
        expect(prop1.labels).to.not.include.members(['new']);
        expect(prop1.labels).to.not.include.members(['removed']);
      });

      it('should remove the changed label from unchanged props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        // simulate a property as marked as changed
        repoProp1.labels.push('changed');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1') > -1));

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(service.labels).to.not.include.members(['changed']);
        expect(prop1.labels).to.not.include.members(['changed']);
      });

      it('should report changed property type', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties3', 'prop1');
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties3', 'prop1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties3 property prop1 has changed type']);

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties3', 'prop1');
        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.type).to.equal(newProp1.type);
      });

      it('should report changed property get/set', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties4', 'prop1');
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties4', 'prop1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties4 property prop1 has changed setter']);

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties4', 'prop1');
        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.get).to.equal(newProp1.get);
        expect(prop1.set).to.equal(newProp1.set);
      });

      it('should report changed property docs, preserve docs and update srcDocs', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties5', 'prop1');
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties5', 'prop1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties5 property prop1 has changed summary',
          'Service ChangeServiceProperties5 property prop1 has changed description',
          'Service ChangeServiceProperties5 property prop1 has a new link http://new-link',
          'Service ChangeServiceProperties5 property prop1 link http://repo-link was removed']);

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties5', 'prop1');
        expect(service.labels).to.include.members(['changed']);
        expect(prop1.labels).to.include.members(['changed']);
        expect(prop1.srcDocs).to.deep.equal(newProp1.srcDocs);
        expect(prop1.src).to.deep.equal(repoProp1.src);
      });

      it('should detect change in property location but not report the service or property as changed', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties6', 'prop1');
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties6', 'prop1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1));

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties6', 'prop1');
        expect(service.labels).to.not.include.members(['changed']);
        expect(prop1.labels).to.not.include.members(['changed']);
        expect(prop1.locations).to.deep.equal(newProp1.locations);
      });

      it('should update property extra but not report the service has changed', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');
        repoProp.extra = {thePlugin: 'old'};
        newProp.extra = {thePlugin: 'new'};

        let customMergedRepo = merge(newRepo, repo);

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1));

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(prop.extra).to.deep.equal(newProp.extra);
        expect(service.labels).to.not.include.members(['changed']);
      });

      it('should detect change in property extra and let plugin control the merge', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1');
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1');
        repoProp.extra = {thePlugin: 'old'};
        newProp.extra = {thePlugin: 'new'};

        let customMergedRepo = merge(newRepo, repo, ['../test/plugin']);

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceProperties1 property prop1 has changed extra.thePlugin']);

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1');
        expect(prop.extra).to.deep.equal(newProp.extra);
        expect(service.labels).to.include.members(['changed']);
      });
    });

    describe('service operations', function() {
      it('should not report any change if no operations has changed', function() {
        let {operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1');

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1));

        let {operation} = repoServiceOperation(defaultMergedRepo.repo, 'ChangeServiceOperations1', 'operations1');
        expect(operation).to.containSubset(newOperation);
      });

      it('should report added and removed operations', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations2'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceOperations2'));
        let operation3 = service.operations.find(memberByName('operation3'));
        let operation2 = service.operations.find(memberByName('operation2'));
        let newOperation3 = newService.operations.find(memberByName('operation3'));
        let repoOperation2 = repoService.operations.find(memberByName('operation2'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations2 has a new operation operation3',
          'Service ChangeServiceOperations2 operation operation2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation3.labels).to.include.members(['new']);
        expect(operation3).to.containSubset(newOperation3);
        expect(operation2.labels).to.include.members(['removed']);
        expect(operation2).to.containSubset(repoOperation2);
      });

      it('should report changes in param type', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation1 = service.operations.find(memberByName('operation1'));
        let newOperation1 = newService.operations.find(memberByName('operation1'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation1 has changed param input type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation1.labels).to.include.members(['changed']);
        operation1.params.forEach((param, index) => {
          let newParam = newOperation1.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should report changes in param name', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation2 = service.operations.find(memberByName('operation2'));
        let newOperation2 = newService.operations.find(memberByName('operation2'));

        expect(defaultMergedRepo.messages).to.containSubset([
          'Service ChangeServiceOperations3 operation operation2 has changed param name from input to anotherInput']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation2.labels).to.include.members(['changed']);
        operation2.params.forEach((param, index) => {
          let newParam = newOperation2.params[index];
          expect(param.name).to.equal(newParam.name);
        })
      });

      it('should report changes in param doc', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation3 = service.operations.find(memberByName('operation3'));
        let newOperation3 = newService.operations.find(memberByName('operation3'));
        let repoOperation3 = repoService.operations.find(memberByName('operation3'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation3 has changed param input doc']);

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
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation4 = service.operations.find(memberByName('operation4'));
        let newOperation4 = newService.operations.find(memberByName('operation4'));
        let repoOperation4 = repoService.operations.find(memberByName('operation4'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation4 has a new param input2']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation4.labels).to.include.members(['changed']);

        for (let i = repoOperation4.params.length; i < newOperation4.params.length; i++) {
          let newParam = newOperation4.params[i];
          let param = operation4.params[i];
          expect(param).to.containSubset(newParam);
        }

      });

      it('should report removed params', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation5 = service.operations.find(memberByName('operation5'));
        let newOperation5 = newService.operations.find(memberByName('operation5'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation5 param input2 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation5.labels).to.include.members(['changed']);
        expect(operation5.params.length).to.equal(newOperation5.params.length);

      });

      it('should report changes in complex param type', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation6 = service.operations.find(memberByName('operation6'));
        let newOperation6 = newService.operations.find(memberByName('operation6'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation6 has changed param input type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation6.labels).to.include.members(['changed']);
        operation6.params.forEach((param, index) => {
          let newParam = newOperation6.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should report changes in return type', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations6'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations6'));
        let operation1 = service.operations.find(memberByName('operation1'));
        let newOperation1 = newService.operations.find(memberByName('operation1'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations6 operation operation1 has changed return type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation1.labels).to.include.members(['changed']);
        expect(operation1.ret.type).to.deep.equal(newOperation1.ret.type);
      });

      it('should report changes in complex return type', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations6'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations6'));
        let operation2 = service.operations.find(memberByName('operation2'));
        let newOperation2 = newService.operations.find(memberByName('operation2'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations6 operation operation2 has changed return type']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation2.labels).to.include.members(['changed']);
        expect(operation2.ret.type).to.deep.equal(newOperation2.ret.type);
      });

      it('should report changes in return doc', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations7'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations7'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceOperations7'));
        let operation1 = service.operations.find(memberByName('operation1'));
        let newOperation1 = newService.operations.find(memberByName('operation1'));
        let repoOperation1 = repoService.operations.find(memberByName('operation1'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations7 operation operation1 has changed return doc']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation1.labels).to.include.members(['changed']);
        expect(operation1.ret.doc).to.equal(repoOperation1.ret.doc);
        expect(operation1.ret.srcDoc).to.equal(newOperation1.ret.srcDoc);

      });

      it('should not report any change if no operations has changed - for complex typed', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations3'));
        let operation = service.operations.find(memberByName('operations7'));
        let newOperation = newService.operations.find(memberByName('operations7'));

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('operation7') > -1));

        expect(operation).to.containSubset(newOperation);
      });

      it('should report changed operation docs, preserve docs and update srcDocs', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations4'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations4'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceOperations4'));
        let operation = service.operations.find(memberByName('operation1'));
        let newOperation = newService.operations.find(memberByName('operation1'));
        let repoOperation = repoService.operations.find(memberByName('operation1'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations4 operation operation1 has changed summary',
          'Service ChangeServiceOperations4 operation operation1 has changed description']);

        expect(service.labels).to.include.members(['changed']);
        expect(operation.labels).to.include.members(['changed']);
        expect(operation.srcDocs).to.deep.equal(newOperation.srcDocs);
        expect(operation.src).to.deep.equal(repoOperation.src);
      });

      it('should detect change in operation location but not report the service or property as changed', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceOperations5'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceOperations5'));
        let operation = service.operations.find(memberByName('operation1'));
        let newOperation = newService.operations.find(memberByName('operation1'));

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations5') > -1));

        expect(service.labels).to.not.include.members(['changed']);
        expect(operation.labels).to.not.include.members(['changed']);
        expect(operation.locations).to.deep.equal(newOperation.locations);
      });

      it('should update callback extra but not report the service has changed', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1');
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1');
        repoOperation.extra = {thePlugin: 'old'};
        newOperation.extra = {thePlugin: 'new'};

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1));

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1');
        expect(operation.extra).to.deep.equal(newOperation.extra);
        expect(service.labels).to.not.include.members(['changed']);
      });

      it('should detect change in callback extra and let plugin control the merge', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1');
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1');
        repoOperation.extra = {thePlugin: 'old'};
        newOperation.extra = {thePlugin: 'new'};

        let mergedRepo = merge(newRepo, repo, ['../test/plugin']);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations1 operation operations1 has changed extra.thePlugin']);

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1');
        expect(operation.extra).to.deep.equal(newOperation.extra);
        expect(service.labels).to.include.members(['changed']);
      });
    });

    describe('service callbacks', function() {
      it('should not report any change if no callbacks has changed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks1') > -1));

        let {callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1');
        expect(callback).to.containSubset(newCallback);
      });

      it('should report added and removed callbacks', function() {
        let {repo: newRepo, callback: newCallback3} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks2', 'callback3');
        let {repo: repo, callback: repoCallback2} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks2', 'callback2');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks2 has a new callback callback3',
          'Service ChangeServiceCallbacks2 callback callback2 was removed']);

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks2', 'callback2');
        let {callback: callback3} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks2', 'callback3');
        expect(service.labels).to.include.members(['changed']);
        expect(callback3.labels).to.include.members(['new']);
        expect(callback3).to.containSubset(newCallback3);
        expect(callback2.labels).to.include.members(['removed']);
        expect(callback2).to.containSubset(repoCallback2);
      });

      it('should report changes in param type', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback1');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback1 has changed param input type']);

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback1');
        expect(service.labels).to.include.members(['changed']);
        expect(callback1.labels).to.include.members(['changed']);
        callback1.params.forEach((param, index) => {
          let newParam = newCallback1.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should report changes in param name', function() {
        let {repo: newRepo, callback: newCallback2} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback2');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback2');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset([
          'Service ChangeServiceCallbacks3 callback callback2 has changed param name from input to anotherInput']);

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback2');
        expect(service.labels).to.include.members(['changed']);
        expect(callback2.labels).to.include.members(['changed']);
        callback2.params.forEach((param, index) => {
          let newParam = newCallback2.params[index];
          expect(param.name).to.equal(newParam.name);
        })
      });

      it('should report changes in param doc', function() {
        let {repo: newRepo, callback: newCallback3} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback3');
        let {repo: repo, callback: repoCallback3} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback3');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback3 has changed param input doc']);

        let {service: service, callback: callback3} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback3');
        expect(service.labels).to.include.members(['changed']);
        expect(callback3.labels).to.include.members(['changed']);
        callback3.params.forEach((param, index) => {
          let newParam = newCallback3.params[index];
          let repoParam = repoCallback3.params[index];
          expect(param.doc).to.equal(repoParam.doc);
          expect(param.srcDoc).to.equal(newParam.srcDoc);
        })
      });

      it('should report new params', function() {
        let {repo: newRepo, callback: newCallback4} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback4');
        let {repo: repo, callback: repoCallback4} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback4');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback4 has a new param input2']);

        let {service: service, callback: callback4} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback4');
        expect(service.labels).to.include.members(['changed']);
        expect(callback4.labels).to.include.members(['changed']);

        for (let i = repoCallback4.params.length; i < newCallback4.params.length; i++) {
          let newParam = newCallback4.params[i];
          let param = callback4.params[i];
          expect(param).to.containSubset(newParam);
        }

      });

      it('should report removed params', function() {
        let {repo: newRepo, callback: newCallback5} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback5');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback5');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback5 param input2 was removed']);

        let {service: service, callback: callback5} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback5');
        expect(service.labels).to.include.members(['changed']);
        expect(callback5.labels).to.include.members(['changed']);
        expect(callback5.params.length).to.equal(newCallback5.params.length);

      });

      it('should report changes in complex param type', function() {
        let {repo: newRepo, callback: newCallback6} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback6');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback6');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback6 has changed param input type']);

        let {service: service, callback: callback6} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback6');
        expect(service.labels).to.include.members(['changed']);
        expect(callback6.labels).to.include.members(['changed']);
        callback6.params.forEach((param, index) => {
          let newParam = newCallback6.params[index];
          expect(param.type).to.deep.equal(newParam.type);
        })
      });

      it('should report changes in return type', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks6', 'callback1');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks6', 'callback1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks6 callback callback1 has changed return type']);

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks6', 'callback1');
        expect(service.labels).to.include.members(['changed']);
        expect(callback1.labels).to.include.members(['changed']);
        expect(callback1.ret.type).to.deep.equal(newCallback1.ret.type);
      });

      it('should report changes in complex return type', function() {
        let {repo: newRepo, callback: newCallback2} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks6', 'callback2');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks6', 'callback2');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks6 callback callback2 has changed return type']);

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks6', 'callback2');
        expect(service.labels).to.include.members(['changed']);
        expect(callback2.labels).to.include.members(['changed']);
        expect(callback2.ret.type).to.deep.equal(newCallback2.ret.type);
      });

      it('should report changes in return doc', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks7', 'callback1');
        let {repo: repo, callback: repoCallback1} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks7', 'callback1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks7 callback callback1 has changed return doc']);

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks7', 'callback1');
        expect(service.labels).to.include.members(['changed']);
        expect(callback1.labels).to.include.members(['changed']);
        expect(callback1.ret.doc).to.equal(repoCallback1.ret.doc);
        expect(callback1.ret.srcDoc).to.equal(newCallback1.ret.srcDoc);

      });

      it('should not report any change if no callbacks has changed - for complex typed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callbacks7');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callbacks7');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('callback7') > -1));

        let {callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callbacks7');
        expect(callback).to.containSubset(newCallback);
      });

      it('should report changed callback docs, preserve docs and update srcDocs', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks4', 'callback1');
        let {repo: repo, callback: repoCallback} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks4', 'callback1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks4 callback callback1 has changed summary',
          'Service ChangeServiceCallbacks4 callback callback1 has changed description']);

        let {service: service, callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks4', 'callback1');
        expect(service.labels).to.include.members(['changed']);
        expect(callback.labels).to.include.members(['changed']);
        expect(callback.srcDocs).to.deep.equal(newCallback.srcDocs);
        expect(callback.src).to.deep.equal(repoCallback.src);
      });

      it('should detect change in callback location but not report the service or property as changed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks5', 'callback1');
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks5', 'callback1');

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks5') > -1));

        let {service: service, callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks5', 'callback1');
        expect(service.labels).to.not.include.members(['changed']);
        expect(callback.labels).to.not.include.members(['changed']);
        expect(callback.locations).to.deep.equal(newCallback.locations);
      });

      it('should update callback extra but not report the service has changed', function() {
        let {repo: repo, callback: repoCallback} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1');
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1');
        repoCallback.extra = {thePlugin: 'old'};
        newCallback.extra = {thePlugin: 'new'};

        let mergedRepo = merge(newRepo, repo);

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks1') > -1));

        let {service, callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1');
        expect(callback.extra).to.deep.equal(newCallback.extra);
        expect(service.labels).to.not.include.members(['changed']);
      });

      it('should detect change in callback extra and let plugin control the merge', function() {
        let {repo: repo, callback: repoCallback} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1');
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1');
        repoCallback.extra = {thePlugin: 'old'};
        newCallback.extra = {thePlugin: 'new'};

        let mergedRepo = merge(newRepo, repo, ['../test/plugin']);

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks1 callback callbacks1 has changed extra.thePlugin']);

        let {service, callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1');
        expect(callback.extra).to.deep.equal(newCallback.extra);
        expect(service.labels).to.include.members(['changed']);
      });

    });

    describe('service messages', function() {
      it('should not report any change if no messages has changed', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages1'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages1'));
        let message = service.messages.find(memberByName('Message1'));
        let newMessage = newService.messages.find(memberByName('Message1'));

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceMessages1') > -1));

        expect(message).to.containSubset(newMessage);
      });

      it('should added and removed messages', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages3'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages3'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceMessages3'));
        let removedMessage = service.messages.find(memberByName('Message3'));
        let addedMessage = service.messages.find(memberByName('Message4'));
        let newMessage = newService.messages.find(memberByName('Message4'));
        let repoMessage = repoService.messages.find(memberByName('Message3'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages3 has a new message Message4',
          'Service ChangeServiceMessages3 message Message3 was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(addedMessage.labels).to.include.members(['new']);
        expect(addedMessage).to.containSubset(newMessage);
        expect(removedMessage.labels).to.include.members(['removed']);
        expect(removedMessage).to.containSubset(repoMessage);
      });

      it('should added and removed message properties', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages2'));
        let message = service.messages.find(memberByName('Message2'));
        let newMessage = newService.messages.find(memberByName('Message2'));
        let oldProperty = message.members.find(memberByName('oldProperty'));
        let newProperty = message.members.find(memberByName('newProperty'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message2 has a new member newProperty',
          'Service ChangeServiceMessages2 message Message2 member oldProperty was removed']);

        expect(service.labels).to.include.members(['changed']);
        expect(message.labels).to.include.members(['changed']);
        expect(message.members).to.containSubset(newMessage.members);
        expect(newProperty).to.be.exist;
        expect(oldProperty).to.be.undefined;
      });

      it('should report change in message member type', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages2'));
        let message = service.messages.find(memberByName('Message5'));
        let newMessage = newService.messages.find(memberByName('Message5'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message5 member name has changed type']);

        expect(service.labels).to.include.members(['changed']);
        expect(message.labels).to.include.members(['changed']);
        expect(message.members).to.containSubset(newMessage.members);
      });

      it('should report change in message member doc', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages2'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceMessages2'));
        let message = service.messages.find(memberByName('Message6'));
        let newMessage = newService.messages.find(memberByName('Message6'));
        let repoMessage = repoService.messages.find(memberByName('Message6'));

        let member = message.members.find(_ => _.name === 'name');
        let repoMember = repoMessage.members.find(_ => _.name === 'name');
        let newMember = newMessage.members.find(_ => _.name === 'name');

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message6 member name has changed doc']);

        expect(service.labels).to.include.members(['changed']);
        expect(message.labels).to.include.members(['changed']);
        expect(member.srcDocs).to.containSubset(newMember.srcDocs);
        expect(member.docs).to.containSubset(repoMember.docs);
      });

      it('should report changed message docs, preserve docs and update srcDocs', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages2'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages2'));
        let repoService = baseRepo.find(serviceByName('ChangeServiceMessages2'));
        let message = service.messages.find(memberByName('Message7'));
        let newMessage = newService.messages.find(memberByName('Message7'));
        let repoMessage = repoService.messages.find(memberByName('Message7'));

        expect(defaultMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message7 has changed summary',
          'Service ChangeServiceMessages2 message Message7 has changed description']);

        expect(service.labels).to.include.members(['changed']);
        expect(message.labels).to.include.members(['changed']);
        expect(message.srcDocs).to.deep.equal(newMessage.srcDocs);
        expect(message.src).to.deep.equal(repoMessage.src);
      });

      it('should detect change in message location but not report is has changed', function() {
        let service = defaultMergedRepo.repo.find(serviceByName('ChangeServiceMessages4'));
        let newService = baseNewRepo.find(serviceByName('ChangeServiceMessages4'));
        let message = service.messages.find(memberByName('Message8'));
        let newMessage = newService.messages.find(memberByName('Message8'));

        expect(defaultMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceMessages4') > -1));

        expect(service.labels).to.not.include.members(['changed']);
        expect(message.labels).to.not.include.members(['changed']);
        expect(message.locations).to.deep.equal(newMessage.locations);
      });
    });
  });
});
