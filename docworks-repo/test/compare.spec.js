import chai from 'chai'
import chaiSubset from 'chai-subset'
import runJsDoc from 'docworks-jsdoc2spec'
import {merge} from '../lib/index'
import fs from 'fs-extra'

chai.use(chaiSubset)
const expect = chai.expect

function extractServices(path) {
  return runJsDoc({'include': [path],
    'includePattern': '.+\\.(js)?$',}).services
}

function serviceByName(memberof, name) {
  let noMemberOf = !name
  name = name?name:memberof
  return (_) => (_.name === name) && (noMemberOf || _.memberOf === memberof)
}

function memberByName(name) {
  return (_) => (_.name === name)
}

function getRepoService(baseRepo, serviceName) {
  let repo = baseRepo.filter(_ => _.name === serviceName)
  let service = repo.find(serviceByName(serviceName))
  return {repo, service}
}

function repoServiceProp(baseRepo, serviceName, propName) {
  let repo = baseRepo.filter(_ => _.name === serviceName)
  let service = repo.find(serviceByName(serviceName))
  let prop = service.properties.find(memberByName(propName))
  return {repo, service, prop}
}

function repoServiceOperation(baseRepo, serviceName, operationName) {
  let repo = baseRepo.filter(_ => _.name === serviceName)
  let service = repo.find(serviceByName(serviceName))
  let operation = service.operations.find(memberByName(operationName))
  return {repo, service, operation}
}

function repoServiceCallback(baseRepo, serviceName, operationName) {
  let repo = baseRepo.filter(_ => _.name === serviceName)
  let service = repo.find(serviceByName(serviceName))
  let callback = service.callbacks.find(memberByName(operationName))
  return {repo, service, callback}
}

function repoServiceMessages(baseRepo, serviceName, messageName) {
  let repo = baseRepo.filter(_ => _.name === serviceName)
  let service = repo.find(serviceByName(serviceName))
  let message = service.messages.find(memberByName(messageName))
  return {repo, service, message}
}

describe('compare repo', function() {

  beforeEach(() => {
    return fs.remove('./tmp')
  })

  it('should report no change if there are no changes and return the repo', async function() {
    let newRepo = extractServices('./test/compare/newVersion/noChange')
    let repo = extractServices('./test/compare/repoVersion/noChange')

    let mergedRepo = merge(newRepo, repo)

    expect(mergedRepo.messages).to.be.empty
    expect(mergedRepo.repo).to.containSubset(repo)
  })

  it('should report added ServiceB and removed ServiceC', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices')
    let repo = extractServices('./test/compare/repoVersion/changeServices')

    let mergedRepo = merge(newRepo, repo)

    let serviceA = mergedRepo.repo.find(serviceByName('ServiceA'))
    let serviceB = mergedRepo.repo.find(serviceByName('ServiceB'))
    let serviceC = mergedRepo.repo.find(serviceByName('ServiceC'))

    expect(mergedRepo.messages).to.containSubset(['Service ServiceB is new', 'Service ServiceC was removed'])
    expect(serviceA.labels).to.be.empty
    expect(serviceB.labels).to.include.members(['new'])
    expect(serviceC.labels).to.include.members(['removed'])
  })

  it('should remove the removed label from a re-added service', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices')
    let repo = extractServices('./test/compare/repoVersion/changeServices')
    // simulate existing service that is marked as removed
    let repoServiceA = repo.find(serviceByName('ServiceA'))
    repoServiceA.labels = ['removed']

    let mergedRepo = merge(newRepo, repo)

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceA'))

    expect(serviceB.labels).to.not.include.members(['removed'])
  })

  it('should not re-report removed on a removed service', async function() {
    let emptyRepo = []
    let repo = extractServices('./test/compare/repoVersion/changeServices')
    // simulate existing service that is marked as removed
    let repoServiceA = repo.find(serviceByName('ServiceA'))
    repoServiceA.labels = ['removed']

    let mergedRepo = merge(emptyRepo, [repoServiceA])

    expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ServiceA') > -1))

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceA'))
    expect(serviceB.labels).to.include.members(['removed'])
  })

  it('should remove the changed label if a service did not change', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices')
    let repo = extractServices('./test/compare/repoVersion/changeServices')
    // simulate existing service that is marked as changed
    let repoServiceA = repo.find(serviceByName('ServiceA'))
    repoServiceA.labels = ['changed']

    let mergedRepo = merge(newRepo, repo)

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceA'))

    expect(serviceB.labels).to.not.include.members(['changed'])
  })

  it('should remove the new label from a new service that is removed', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeServices')
    let repo = extractServices('./test/compare/repoVersion/changeServices')
    // simulate existing serviceC as new
    let repoServiceC = repo.find(serviceByName('ServiceC'))
    repoServiceC.labels = ['new']

    let mergedRepo = merge(newRepo, repo)

    let serviceB = mergedRepo.repo.find(serviceByName('ServiceC'))

    expect(serviceB.labels).to.include.members(['removed'])
    expect(serviceB.labels).to.not.include.members(['new'])
  })

  it('should report added package1.ServiceB and removed ServiceB', async function() {
    let newRepo = extractServices('./test/compare/newVersion/changeNestedServices')
    let repo = extractServices('./test/compare/repoVersion/changeNestedServices')

    let mergedRepo = merge(newRepo, repo)

    let serviceA = mergedRepo.repo.find(serviceByName('package1', 'ServiceA'))
    let serviceB = mergedRepo.repo.find(serviceByName('ServiceB'))
    let serviceB2 = mergedRepo.repo.find(serviceByName('package1', 'ServiceB'))

    expect(mergedRepo.messages).to.containSubset(['Service package1.ServiceB is new', 'Service ServiceB was removed'])
    expect(serviceA.labels).to.be.empty
    expect(serviceB.labels).to.include.members(['removed'])
    expect(serviceB2.labels).to.include.members(['new'])
  })

  describe('compare a service', function() {
    let baseNewRepo, baseRepo
    beforeEach(() => {
      baseNewRepo = extractServices('./test/compare/newVersion/serviceContent')
      baseRepo = extractServices('./test/compare/repoVersion/serviceContent')
    })

    describe('service attributes', function() {
      it('should detect change in mixes', function() {
        let {repo} = getRepoService(baseRepo, 'ChangeServiceAttributes1')
        let {repo: newRepo} = getRepoService(baseNewRepo, 'ChangeServiceAttributes1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes1 has a new mixes a',
          'Service ChangeServiceAttributes1 mixes b was removed'])

        let {service} = getRepoService(mergedRepo.repo, 'ChangeServiceAttributes1')
        expect(service.mixes).to.have.members(['a'])
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in summary', function() {
        let {repo} = getRepoService(baseRepo, 'ChangeServiceAttributes2')
        let {repo: newRepo, service: newService} = getRepoService(baseNewRepo, 'ChangeServiceAttributes2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes2 has changed summary'])

        let {service} = getRepoService(mergedRepo.repo, 'ChangeServiceAttributes2')
        expect(service.docs.summary).to.equal(newService.docs.summary)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in description', function() {
        let {repo} = getRepoService(baseRepo, 'ChangeServiceAttributes3')
        let {repo: newRepo, service: newService} = getRepoService(baseNewRepo, 'ChangeServiceAttributes3')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes3 has changed description'])

        let {service} = getRepoService(mergedRepo.repo, 'ChangeServiceAttributes3')
        expect(service.docs.description).to.equal(newService.docs.description)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in a link', function() {
        let {repo} = getRepoService(baseRepo, 'ChangeServiceAttributes4')
        let {repo: newRepo, service: newService} = getRepoService(baseNewRepo, 'ChangeServiceAttributes4')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes4 has a new link http://someplace'])

        let {service} = getRepoService(mergedRepo.repo, 'ChangeServiceAttributes4')
        expect(service.docs.links).to.have.members(newService.docs.links)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in location but not report the service has changed', function() {
        let {repo} = getRepoService(baseRepo, 'ChangeServiceAttributes5')
        let {repo: newRepo, service: newService} = getRepoService(baseNewRepo, 'ChangeServiceAttributes5')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes5') > -1))

        let {service} = getRepoService(mergedRepo.repo, 'ChangeServiceAttributes5')
        expect(service.location).to.deep.equal(newService.location)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update extra but not report the service has changed', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'))
        repoService.extra = {me: 'old'}
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'))
        newService.extra = {me: 'new'}

        let customMergedRepo = merge(baseNewRepo, baseRepo)

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1))

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'))
        expect(service.extra).to.deep.equal(newService.extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update docs extra but not report the service has changed', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'))
        repoService.docs.extra = {me: 'old'}
        repoService.docs.examples = [{title: 'title', body: 'body', extra: {me: 'old'}}]
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'))
        newService.docs.extra = {me: 'new'}
        newService.docs.examples = [{title: 'title', body: 'body', extra: {me: 'new'}}]

        let customMergedRepo = merge(baseNewRepo, baseRepo)

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1))

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'))
        expect(service.docs.extra).to.deep.equal(newService.docs.extra)
        expect(service.docs.examples[0].extra).to.deep.equal(newService.docs.examples[0].extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should detect change in extra and let plugin (loaded with relative path) control the merge', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'))
        repoService.extra = {thePlugin: 'old'}
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'))
        newService.extra = {thePlugin: 'new'}

        let customMergedRepo = merge(baseNewRepo, baseRepo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes6 has changed extra.thePlugin'])

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'))
        expect(service.extra).to.deep.equal(newService.extra)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should update docs extra and let plugin control the merge', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'))
        repoService.docs.extra = {thePlugin: 'old'}
        repoService.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'))
        newService.docs.extra = {thePlugin: 'new'}
        newService.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let customMergedRepo = merge(baseNewRepo, baseRepo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes6.docs has changed extra.thePlugin',
          'Service ChangeServiceAttributes6.examples[0] has changed extra.thePlugin'])

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'))
        expect(service.docs.extra).to.deep.equal(newService.docs.extra)
        expect(service.docs.examples[0].extra).to.deep.equal(newService.docs.examples[0].extra)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should compare docs examples', function() {
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes7'))

        let customMergedRepo = merge(baseNewRepo, baseRepo)

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes7.examples[1] has changed body',
          'Service ChangeServiceAttributes7.examples has 1 examples removed'])

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes7'))
        expect(service.docs).to.deep.equal(newService.docs)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in extra and let plugin (loaded with relative path to cwd) control the merge', function() {
        let repoService = baseRepo.find(serviceByName('ChangeServiceAttributes6'))
        repoService.extra = {thePlugin: 'old'}
        let newService = baseNewRepo.find(serviceByName('ChangeServiceAttributes6'))
        newService.extra = {thePlugin: 'new'}

        let customMergedRepo = merge(baseNewRepo, baseRepo, ['test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceAttributes6 has changed extra.thePlugin'])

        let service = customMergedRepo.repo.find(serviceByName('ChangeServiceAttributes6'))
        expect(service.extra).to.deep.equal(newService.extra)
        expect(service.labels).to.include.members(['changed'])
      })
    })

    describe('service properties', function() {
      it('should not report any change if no properties has changed', function() {
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')

        let mergedRepo = merge(newRepo, repo)
        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1))

        let {prop: prop} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(prop).to.deep.equal(newProp)
      })

      it('should report added and removed properties', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop1')
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2')

        let mergedRepo = merge(newRepo, repo)
        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties2 has a new property prop1',
          'Service ChangeServiceProperties2 property prop2 was removed'])

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop1')
        let {prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2')
        expect(service.labels).to.include.members(['changed'])
        expect(prop1.labels).to.include.members(['new'])
        expect(prop1).to.containSubset(newProp1)
        expect(prop2.labels).to.include.members(['removed'])
        expect(prop2).to.containSubset(repoProp2)
      })

      it('should not report removed properties if they have the removed label', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop1')
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2')
        // simulate a property as marked as removed
        repoProp2.labels.push('removed')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties2 property prop2 was removed') > -1))

        let {service, prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2')
        expect(service.labels).to.include.members(['changed'])
        expect(prop2.labels).to.include.members(['removed'])
        expect(prop2).to.containSubset(repoProp2)
      })

      it('should remove the removed label from re-added props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        // simulate a property as marked as removed
        repoProp1.labels.push('removed')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1 was removed') > -1))

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(prop1.labels).to.include.members(['new'])
        expect(prop1.labels).to.not.include.members(['removed'])
      })

      it('should remove the new label from removed props, and mark service as changed', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties2', 'prop2')
        let {repo, prop: repoProp2} = repoServiceProp(baseRepo, 'ChangeServiceProperties2', 'prop2')
        // simulate a property as a new prop
        repoProp2.labels.push('new')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties2 property prop2 was removed'])

        let {service, prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties2', 'prop2')
        expect(service.labels).to.include.members(['changed'])
        expect(prop2.labels).to.not.include.members(['new'])
        expect(prop2.labels).to.include.members(['removed'])
      })

      it('should remove the new label from existing props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        // simulate a property as marked as new
        repoProp1.labels.push('new')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1') > -1))

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(prop1.labels).to.not.include.members(['new'])
        expect(prop1.labels).to.not.include.members(['removed'])
      })

      it('should remove the changed label from unchanged props', function() {
        let {repo: newRepo} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo, prop: repoProp1} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        // simulate a property as marked as changed
        repoProp1.labels.push('changed')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('Service ChangeServiceProperties1 property prop1') > -1))

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(prop1.labels).to.not.include.members(['changed'])
      })

      it('should report changed property type', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties3', 'prop1')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties3', 'prop1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties3 property prop1 has changed type'])

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties3', 'prop1')
        expect(service.labels).to.include.members(['changed'])
        expect(prop1.labels).to.include.members(['changed'])
        expect(prop1.type).to.equal(newProp1.type)
      })

      it('should report changed property default value', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties7', 'prop1')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties7', 'prop1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties7 property prop1 has changed default value'])

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties7', 'prop1')
        expect(service.labels).to.include.members(['changed'])
        expect(prop1.labels).to.include.members(['changed'])
        expect(prop1.defaultValue).to.equal(newProp1.defaultValue)
      })

      it('should report changed property get/set', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties4', 'prop1')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties4', 'prop1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties4 property prop1 has changed setter'])

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties4', 'prop1')
        expect(service.labels).to.include.members(['changed'])
        expect(prop1.labels).to.include.members(['changed'])
        expect(prop1.get).to.equal(newProp1.get)
        expect(prop1.set).to.equal(newProp1.set)
      })

      it('should report changed property docs, update docs', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties5', 'prop1')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties5', 'prop1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties5 property prop1 has changed summary',
          'Service ChangeServiceProperties5 property prop1 has changed description',
          'Service ChangeServiceProperties5 property prop1 has a new link http://new-link',
          'Service ChangeServiceProperties5 property prop1 link http://repo-link was removed'])

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties5', 'prop1')
        expect(service.labels).to.include.members(['changed'])
        expect(prop1.labels).to.include.members(['changed'])
        expect(prop1.docs).to.deep.equal(newProp1.docs)
      })

      it('should report changed property doc examples, update docs examples', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties5', 'prop2')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties5', 'prop2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceProperties5 property prop2.examples has 1 new examples'])

        let {service, prop: prop2} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties5', 'prop2')
        expect(service.labels).to.include.members(['changed'])
        expect(prop2.labels).to.include.members(['changed'])
        expect(prop2.docs.examples).to.deep.equal(newProp1.docs.examples)
      })

      it('should detect change in property location but not report the service or property as changed', function() {
        let {repo: newRepo, prop: newProp1} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties6', 'prop1')
        let {repo} = repoServiceProp(baseRepo, 'ChangeServiceProperties6', 'prop1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceAttributes6') > -1))

        let {service, prop: prop1} = repoServiceProp(mergedRepo.repo, 'ChangeServiceProperties6', 'prop1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(prop1.labels).to.not.include.members(['changed'])
        expect(prop1.locations).to.deep.equal(newProp1.locations)
      })

      it('should update property extra but not report the service has changed', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        repoProp.extra = {thePlugin: 'old'}
        newProp.extra = {thePlugin: 'new'}

        let customMergedRepo = merge(newRepo, repo)

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1))

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(prop.extra).to.deep.equal(newProp.extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update property docs extra but not report the service has changed', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        repoProp.docs.extra = {thePlugin: 'old'}
        repoProp.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newProp.docs.extra = {thePlugin: 'new'}
        newProp.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let customMergedRepo = merge(newRepo, repo)

        expect(customMergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceProperties1') > -1))

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(prop.docs.extra).to.deep.equal(newProp.docs.extra)
        expect(prop.docs.examples[0].extra).to.deep.equal(newProp.docs.examples[0].extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update property docs extra and let plugin control the merge', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        repoProp.docs.extra = {thePlugin: 'old'}
        repoProp.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newProp.docs.extra = {thePlugin: 'new'}
        newProp.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let customMergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceProperties1 property prop1.docs has changed extra.thePlugin',
          'Service ChangeServiceProperties1 property prop1.examples[0] has changed extra.thePlugin'])

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(prop.docs.extra).to.deep.equal(newProp.docs.extra)
        expect(prop.docs.examples[0].extra).to.deep.equal(newProp.docs.examples[0].extra)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in property extra and let plugin control the merge', function() {
        let {repo: repo, prop: repoProp} = repoServiceProp(baseRepo, 'ChangeServiceProperties1', 'prop1')
        let {repo: newRepo, prop: newProp} = repoServiceProp(baseNewRepo, 'ChangeServiceProperties1', 'prop1')
        repoProp.extra = {thePlugin: 'old'}
        newProp.extra = {thePlugin: 'new'}

        let customMergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceProperties1 property prop1 has changed extra.thePlugin'])

        let {service, prop} = repoServiceProp(customMergedRepo.repo, 'ChangeServiceProperties1', 'prop1')
        expect(prop.extra).to.deep.equal(newProp.extra)
        expect(service.labels).to.include.members(['changed'])
      })
    })

    describe('service operations', function() {
      it('should not report any change if no operations has changed', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1))

        let {operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1')
        expect(operation).to.containSubset(newOperation)
      })

      it('should report added and removed operations', function() {
        let {repo: repo, operation: repoOperation2} = repoServiceOperation(baseRepo, 'ChangeServiceOperations2', 'operation2')
        let {repo: newRepo, operation: newOperation3} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations2', 'operation3')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations2 has a new operation operation3',
          'Service ChangeServiceOperations2 operation operation2 was removed'])

        let {service, operation: operation2} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations2', 'operation2')
        let {operation: operation3} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations2', 'operation3')
        expect(service.labels).to.include.members(['changed'])
        expect(operation3.labels).to.include.members(['new'])
        expect(operation3).to.containSubset(newOperation3)
        expect(operation2.labels).to.include.members(['removed'])
        expect(operation2).to.containSubset(repoOperation2)
      })

      it('should report changes in param type', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation1')
        let {repo: newRepo, operation: newOperation1} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation1 has changed param input type'])

        let {service, operation: operation1} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation1')
        expect(service.labels).to.include.members(['changed'])
        expect(operation1.labels).to.include.members(['changed'])
        operation1.params.forEach((param, index) => {
          let newParam = newOperation1.params[index]
          expect(param.type).to.deep.equal(newParam.type)
        })
      })

      it('should report changes in param name', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation2')
        let {repo: newRepo, operation: newOperation2} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset([
          'Service ChangeServiceOperations3 operation operation2 has changed param name from input to anotherInput'])

        let {service, operation: operation2} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation2')
        expect(service.labels).to.include.members(['changed'])
        expect(operation2.labels).to.include.members(['changed'])
        operation2.params.forEach((param, index) => {
          let newParam = newOperation2.params[index]
          expect(param.name).to.equal(newParam.name)
        })
      })

      it('should report changes in param doc', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation3')
        let {repo: newRepo, operation: newOperation3} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation3')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation3 has changed param input doc'])

        let {service, operation: operation3} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation3')
        expect(service.labels).to.include.members(['changed'])
        expect(operation3.labels).to.include.members(['changed'])
        operation3.params.forEach((param, index) => {
          let newParam = newOperation3.params[index]
          expect(param.doc).to.equal(newParam.doc)
        })
      })

      it('should report new params', function() {
        let {repo: repo, operation: repoOperation4} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation4')
        let {repo: newRepo, operation: newOperation4} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation4')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation4 has a new param input2'])

        let {service, operation: operation4} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation4')
        expect(service.labels).to.include.members(['changed'])
        expect(operation4.labels).to.include.members(['changed'])

        for (let i = repoOperation4.params.length; i < newOperation4.params.length; i++) {
          let newParam = newOperation4.params[i]
          let param = operation4.params[i]
          expect(param).to.containSubset(newParam)
        }

      })

      it('should report removed params', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation5')
        let {repo: newRepo, operation: newOperation5} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation5')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation5 param input2 was removed'])

        let {service, operation: operation5} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation5')
        expect(service.labels).to.include.members(['changed'])
        expect(operation5.labels).to.include.members(['changed'])
        expect(operation5.params.length).to.equal(newOperation5.params.length)

      })

      it('should report changes in complex param type', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation6')
        let {repo: newRepo, operation: newOperation6} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation6')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations3 operation operation6 has changed param input type'])

        let {service, operation: operation6} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation6')
        expect(service.labels).to.include.members(['changed'])
        expect(operation6.labels).to.include.members(['changed'])
        operation6.params.forEach((param, index) => {
          let newParam = newOperation6.params[index]
          expect(param.type).to.deep.equal(newParam.type)
        })
      })

      it('should report changes in return type', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations6', 'operation1')
        let {repo: newRepo, operation: newOperation1} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations6', 'operation1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations6 operation operation1 has changed return type'])

        let {service, operation: operation1} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations6', 'operation1')
        expect(service.labels).to.include.members(['changed'])
        expect(operation1.labels).to.include.members(['changed'])
        expect(operation1.ret.type).to.deep.equal(newOperation1.ret.type)
      })

      it('should report changes in complex return type', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations6', 'operation2')
        let {repo: newRepo, operation: newOperation2} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations6', 'operation2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations6 operation operation2 has changed return type'])

        let {service, operation: operation2} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations6', 'operation2')
        expect(service.labels).to.include.members(['changed'])
        expect(operation2.labels).to.include.members(['changed'])
        expect(operation2.ret.type).to.deep.equal(newOperation2.ret.type)
      })

      it('should report changes in return doc', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations7', 'operation1')
        let {repo: newRepo, operation: newOperation1} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations7', 'operation1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations7 operation operation1 has changed return doc'])

        let {service, operation: operation1} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations7', 'operation1')
        expect(service.labels).to.include.members(['changed'])
        expect(operation1.labels).to.include.members(['changed'])
        expect(operation1.ret.doc).to.equal(newOperation1.ret.doc)

      })

      it('should not report any change if no operations has changed - for complex typed', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations3', 'operation7')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations3', 'operation7')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('operation7') > -1))

        let {operation: operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations3', 'operation7')
        expect(operation).to.containSubset(newOperation)
      })

      it('should report changed operation docs, update docs', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations4', 'operation1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations4', 'operation1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations4 operation operation1 has changed summary',
          'Service ChangeServiceOperations4 operation operation1 has changed description'])

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations4', 'operation1')
        expect(service.labels).to.include.members(['changed'])
        expect(operation.labels).to.include.members(['changed'])
        expect(operation.docs).to.deep.equal(newOperation.docs)
      })

      it('should detect change in operation location but not report the service or property as changed', function() {
        let {repo: repo} = repoServiceOperation(baseRepo, 'ChangeServiceOperations5', 'operation1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations5', 'operation1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations5') > -1))

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations5', 'operation1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(operation.labels).to.not.include.members(['changed'])
        expect(operation.locations).to.deep.equal(newOperation.locations)
      })

      it('should update operation extra but not report the service has changed', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1')
        repoOperation.extra = {thePlugin: 'old'}
        newOperation.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1))

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1')
        expect(operation.extra).to.deep.equal(newOperation.extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update operation docs extra but not report the service has changed', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1')
        repoOperation.docs.extra = {thePlugin: 'old'}
        repoOperation.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newOperation.docs.extra = {thePlugin: 'new'}
        newOperation.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceOperations1') > -1))

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1')
        expect(operation.docs.extra).to.deep.equal(newOperation.docs.extra)
        expect(operation.docs.examples[0].extra).to.deep.equal(newOperation.docs.examples[0].extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update operation docs extra and let plugin control the merge', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1')
        repoOperation.docs.extra = {thePlugin: 'old'}
        repoOperation.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newOperation.docs.extra = {thePlugin: 'new'}
        newOperation.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let customMergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceOperations1 operation operations1.docs has changed extra.thePlugin',
          'Service ChangeServiceOperations1 operation operations1.examples[0] has changed extra.thePlugin'])

        let {service, operation} = repoServiceOperation(customMergedRepo.repo, 'ChangeServiceOperations1', 'operations1')
        expect(operation.docs.extra).to.deep.equal(newOperation.docs.extra)
        expect(operation.docs.examples[0].extra).to.deep.equal(newOperation.docs.examples[0].extra)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in operation extra and let plugin control the merge', function() {
        let {repo: repo, operation: repoOperation} = repoServiceOperation(baseRepo, 'ChangeServiceOperations1', 'operations1')
        let {repo: newRepo, operation: newOperation} = repoServiceOperation(baseNewRepo, 'ChangeServiceOperations1', 'operations1')
        repoOperation.extra = {thePlugin: 'old'}
        newOperation.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceOperations1 operation operations1 has changed extra.thePlugin'])

        let {service, operation} = repoServiceOperation(mergedRepo.repo, 'ChangeServiceOperations1', 'operations1')
        expect(operation.extra).to.deep.equal(newOperation.extra)
        expect(service.labels).to.include.members(['changed'])
      })
    })

    describe('service callbacks', function() {
      it('should not report any change if no callbacks has changed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks1') > -1))

        let {callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1')
        expect(callback).to.containSubset(newCallback)
      })

      it('should report added and removed callbacks', function() {
        let {repo: newRepo, callback: newCallback3} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks2', 'callback3')
        let {repo: repo, callback: repoCallback2} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks2', 'callback2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks2 has a new callback callback3',
          'Service ChangeServiceCallbacks2 callback callback2 was removed'])

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks2', 'callback2')
        let {callback: callback3} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks2', 'callback3')
        expect(service.labels).to.include.members(['changed'])
        expect(callback3.labels).to.include.members(['new'])
        expect(callback3).to.containSubset(newCallback3)
        expect(callback2.labels).to.include.members(['removed'])
        expect(callback2).to.containSubset(repoCallback2)
      })

      it('should report changes in param type', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback1 has changed param input type'])

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback1')
        expect(service.labels).to.include.members(['changed'])
        expect(callback1.labels).to.include.members(['changed'])
        callback1.params.forEach((param, index) => {
          let newParam = newCallback1.params[index]
          expect(param.type).to.deep.equal(newParam.type)
        })
      })

      it('should report changes in param name', function() {
        let {repo: newRepo, callback: newCallback2} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback2')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset([
          'Service ChangeServiceCallbacks3 callback callback2 has changed param name from input to anotherInput'])

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback2')
        expect(service.labels).to.include.members(['changed'])
        expect(callback2.labels).to.include.members(['changed'])
        callback2.params.forEach((param, index) => {
          let newParam = newCallback2.params[index]
          expect(param.name).to.equal(newParam.name)
        })
      })

      it('should report changes in param doc', function() {
        let {repo: newRepo, callback: newCallback3} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback3')
        // eslint-disable-next-line no-unused-vars
        let {repo: repo, callback: repoCallback3} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback3')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback3 has changed param input doc'])

        let {service: service, callback: callback3} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback3')
        expect(service.labels).to.include.members(['changed'])
        expect(callback3.labels).to.include.members(['changed'])
        callback3.params.forEach((param, index) => {
          let newParam = newCallback3.params[index]
          expect(param.doc).to.equal(newParam.doc)
        })
      })

      it('should report new params', function() {
        let {repo: newRepo, callback: newCallback4} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback4')
        let {repo: repo, callback: repoCallback4} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback4')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback4 has a new param input2'])

        let {service: service, callback: callback4} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback4')
        expect(service.labels).to.include.members(['changed'])
        expect(callback4.labels).to.include.members(['changed'])

        for (let i = repoCallback4.params.length; i < newCallback4.params.length; i++) {
          let newParam = newCallback4.params[i]
          let param = callback4.params[i]
          expect(param).to.containSubset(newParam)
        }

      })

      it('should report removed params', function() {
        let {repo: newRepo, callback: newCallback5} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback5')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback5')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback5 param input2 was removed'])

        let {service: service, callback: callback5} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback5')
        expect(service.labels).to.include.members(['changed'])
        expect(callback5.labels).to.include.members(['changed'])
        expect(callback5.params.length).to.equal(newCallback5.params.length)

      })

      it('should report changes in complex param type', function() {
        let {repo: newRepo, callback: newCallback6} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callback6')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callback6')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks3 callback callback6 has changed param input type'])

        let {service: service, callback: callback6} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callback6')
        expect(service.labels).to.include.members(['changed'])
        expect(callback6.labels).to.include.members(['changed'])
        callback6.params.forEach((param, index) => {
          let newParam = newCallback6.params[index]
          expect(param.type).to.deep.equal(newParam.type)
        })
      })

      it('should report changes in return type', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks6', 'callback1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks6', 'callback1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks6 callback callback1 has changed return type'])

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks6', 'callback1')
        expect(service.labels).to.include.members(['changed'])
        expect(callback1.labels).to.include.members(['changed'])
        expect(callback1.ret.type).to.deep.equal(newCallback1.ret.type)
      })

      it('should report changes in complex return type', function() {
        let {repo: newRepo, callback: newCallback2} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks6', 'callback2')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks6', 'callback2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks6 callback callback2 has changed return type'])

        let {service: service, callback: callback2} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks6', 'callback2')
        expect(service.labels).to.include.members(['changed'])
        expect(callback2.labels).to.include.members(['changed'])
        expect(callback2.ret.type).to.deep.equal(newCallback2.ret.type)
      })

      it('should report changes in return doc', function() {
        let {repo: newRepo, callback: newCallback1} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks7', 'callback1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks7', 'callback1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks7 callback callback1 has changed return doc'])

        let {service: service, callback: callback1} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks7', 'callback1')
        expect(service.labels).to.include.members(['changed'])
        expect(callback1.labels).to.include.members(['changed'])
        expect(callback1.ret.doc).to.equal(newCallback1.ret.doc)

      })

      it('should not report any change if no callbacks has changed - for complex typed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks3', 'callbacks7')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks3', 'callbacks7')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('callback7') > -1))

        let {callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks3', 'callbacks7')
        expect(callback).to.containSubset(newCallback)
      })

      it('should report changed callback docs, update docs', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks4', 'callback1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks4', 'callback1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks4 callback callback1 has changed summary',
          'Service ChangeServiceCallbacks4 callback callback1 has changed description'])

        let {service: service, callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks4', 'callback1')
        expect(service.labels).to.include.members(['changed'])
        expect(callback.labels).to.include.members(['changed'])
        expect(callback.docs).to.deep.equal(newCallback.docs)
      })

      it('should detect change in callback location but not report the service or property as changed', function() {
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks5', 'callback1')
        let {repo: repo} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks5', 'callback1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks5') > -1))

        let {service: service, callback: callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks5', 'callback1')
        expect(service.labels).to.not.include.members(['changed'])
        expect(callback.labels).to.not.include.members(['changed'])
        expect(callback.locations).to.deep.equal(newCallback.locations)
      })

      it('should update callback extra but not report the service has changed', function() {
        let {repo: repo, callback: repoCallback} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1')
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1')
        repoCallback.extra = {thePlugin: 'old'}
        newCallback.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceCallbacks1') > -1))

        let {service, callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1')
        expect(callback.extra).to.deep.equal(newCallback.extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should detect change in callback extra and let plugin control the merge', function() {
        let {repo: repo, callback: repoCallback} = repoServiceCallback(baseRepo, 'ChangeServiceCallbacks1', 'callbacks1')
        let {repo: newRepo, callback: newCallback} = repoServiceCallback(baseNewRepo, 'ChangeServiceCallbacks1', 'callbacks1')
        repoCallback.extra = {thePlugin: 'old'}
        newCallback.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceCallbacks1 callback callbacks1 has changed extra.thePlugin'])

        let {service, callback} = repoServiceCallback(mergedRepo.repo, 'ChangeServiceCallbacks1', 'callbacks1')
        expect(callback.extra).to.deep.equal(newCallback.extra)
        expect(service.labels).to.include.members(['changed'])
      })

    })

    describe('service messages', function() {
      it('should not report any change if no messages has changed', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages1', 'Message1')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages1', 'Message1')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceMessages1') > -1))

        let {message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages1', 'Message1')
        expect(message).to.containSubset(newMessage)
      })

      it('should added and removed messages', function() {
        let {repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages3', 'Message3')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages3', 'Message4')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages3 has a new message Message4',
          'Service ChangeServiceMessages3 message Message3 was removed'])

        let {service, message: removedMessage} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages3', 'Message3')
        let {message: addedMessage} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages3', 'Message4')
        expect(service.labels).to.include.members(['changed'])
        expect(addedMessage.labels).to.include.members(['new'])
        expect(addedMessage).to.containSubset(newMessage)
        expect(removedMessage.labels).to.include.members(['removed'])
        expect(removedMessage).to.containSubset(repoMessage)
      })

      it('should added and removed message properties', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages2', 'Message2')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages2', 'Message2')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message2 has a new member newProperty',
          'Service ChangeServiceMessages2 message Message2 member oldProperty was removed'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages2', 'Message2')
        let oldProperty = message.members.find(memberByName('oldProperty'))
        let newProperty = message.members.find(memberByName('newProperty'))
        expect(service.labels).to.include.members(['changed'])
        expect(message.labels).to.include.members(['changed'])
        expect(message.members).to.containSubset(newMessage.members)
        expect(newProperty).to.be.exist
        expect(oldProperty).to.be.undefined
      })

      it('should report change in message member type', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages2', 'Message5')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages2', 'Message5')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message5 member name has changed type'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages2', 'Message5')
        expect(service.labels).to.include.members(['changed'])
        expect(message.labels).to.include.members(['changed'])
        expect(message.members).to.containSubset(newMessage.members)
      })

      it('should report change in message member doc', function() {
        // eslint-disable-next-line no-unused-vars
        let {repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages2', 'Message6')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages2', 'Message6')
        let newMember = newMessage.members.find(_ => _.name === 'name')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message6 member name has changed doc'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages2', 'Message6')
        let member = message.members.find(_ => _.name === 'name')
        expect(service.labels).to.include.members(['changed'])
        expect(message.labels).to.include.members(['changed'])
        expect(member.doc).to.containSubset(newMember.doc)
      })

      it('should report change in message member optional', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages2', 'Message9')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages2', 'Message9')
        let newMember = newMessage.members.find(_ => _.name === 'name')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message9 member name has changed optional'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages2', 'Message9')
        let member = message.members.find(_ => _.name === 'name')
        expect(service.labels).to.include.members(['changed'])
        expect(message.labels).to.include.members(['changed'])
        expect(member.optional).to.containSubset(newMember.optional)
      })

      it('should report changed message docs, update docs', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages2', 'Message7')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages2', 'Message7')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages2 message Message7 has changed summary',
          'Service ChangeServiceMessages2 message Message7 has changed description'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages2', 'Message7')
        expect(service.labels).to.include.members(['changed'])
        expect(message.labels).to.include.members(['changed'])
        expect(message.docs).to.deep.equal(newMessage.docs)
      })

      it('should detect change in message location but not report is has changed', function() {
        let {repo} = repoServiceMessages(baseRepo, 'ChangeServiceMessages4', 'Message8')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages4', 'Message8')

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceMessages4') > -1))

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages4', 'Message8')
        expect(service.labels).to.not.include.members(['changed'])
        expect(message.labels).to.not.include.members(['changed'])
        expect(message.locations).to.deep.equal(newMessage.locations)
      })

      it('should update message extra but not report the service has changed', function() {
        let {repo: repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages1', 'Message1')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages1', 'Message1')
        repoMessage.extra = {thePlugin: 'old'}
        newMessage.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServicemessages1') > -1))

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages1', 'Message1')
        expect(message.extra).to.deep.equal(newMessage.extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update message docs extra but not report the service has changed', function() {
        let {repo: repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages1', 'Message1')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages1', 'Message1')
        repoMessage.docs.extra = {thePlugin: 'old'}
        repoMessage.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newMessage.docs.extra = {thePlugin: 'new'}
        newMessage.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let mergedRepo = merge(newRepo, repo)

        expect(mergedRepo.messages).to.satisfy((messages) => !messages.find(_ => _.indexOf('ChangeServiceMessages1') > -1))

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages1', 'Message1')
        expect(message.docs.extra).to.deep.equal(newMessage.docs.extra)
        expect(message.docs.examples[0].extra).to.deep.equal(newMessage.docs.examples[0].extra)
        expect(service.labels).to.not.include.members(['changed'])
      })

      it('should update message docs extra and let plugin control the merge', function() {
        let {repo: repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages1', 'Message1')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages1', 'Message1')
        repoMessage.docs.extra = {thePlugin: 'old'}
        repoMessage.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'old'}}]
        newMessage.docs.extra = {thePlugin: 'new'}
        newMessage.docs.examples = [{title: 'title', body: 'body', extra: {thePlugin: 'new'}}]

        let customMergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(customMergedRepo.messages).to.containSubset(['Service ChangeServiceMessages1 message Message1.docs has changed extra.thePlugin',
          'Service ChangeServiceMessages1 message Message1.examples[0] has changed extra.thePlugin'])

        let {service, message} = repoServiceMessages(customMergedRepo.repo, 'ChangeServiceMessages1', 'Message1')
        expect(message.docs.extra).to.deep.equal(newMessage.docs.extra)
        expect(message.docs.examples[0].extra).to.deep.equal(newMessage.docs.examples[0].extra)
        expect(service.labels).to.include.members(['changed'])
      })

      it('should detect change in message extra and let plugin control the merge', function() {
        let {repo: repo, message: repoMessage} = repoServiceMessages(baseRepo, 'ChangeServiceMessages1', 'Message1')
        let {repo: newRepo, message: newMessage} = repoServiceMessages(baseNewRepo, 'ChangeServiceMessages1', 'Message1')
        repoMessage.extra = {thePlugin: 'old'}
        newMessage.extra = {thePlugin: 'new'}

        let mergedRepo = merge(newRepo, repo, ['../test/plugin'])

        expect(mergedRepo.messages).to.containSubset(['Service ChangeServiceMessages1 message Message1 has changed extra.thePlugin'])

        let {service, message} = repoServiceMessages(mergedRepo.repo, 'ChangeServiceMessages1', 'Message1')
        expect(message.extra).to.deep.equal(newMessage.extra)
        expect(service.labels).to.include.members(['changed'])
      })

    })
  })
})
