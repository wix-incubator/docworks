import chai from 'chai'
import chaiSubset from 'chai-subset'
import {addRemoveLabels} from '../lib/collection-utils'

chai.use(chaiSubset)
const expect = chai.expect

describe('utilities', function() {
  describe('labels', function() {
    it('should add label to array', function() {
      let labels = []

      let newLabels = addRemoveLabels(labels, 'removed')

      expect(newLabels).to.include.members(['removed'])
    })

    it('should add multiple labels to array', function() {
      let labels = ['L3']

      let newLabels = addRemoveLabels(labels, ['L1', 'L2'])

      expect(newLabels).to.include.members(['L1', 'L2', 'L3'])
    })

    it('should not add duplicate label to array', function() {
      let labels = ['removed']

      let newLabels = addRemoveLabels(labels, 'removed')

      expect(newLabels).to.deep.equal(['removed'])
    })

    it('should remove label from array', function() {
      let labels = ['removed']

      let newLabels = addRemoveLabels(labels, undefined, 'removed')

      expect(newLabels).to.deep.equal([])
    })

    it('should remove multiple labels from array', function() {
      let labels = ['L1', 'L2', 'L3']

      let newLabels = addRemoveLabels(labels, undefined, ['L1', 'L3'])

      expect(newLabels).to.deep.equal(['L2'])
    })

    it('should add and remove multiple labels from array', function() {
      let labels = ['L1', 'L2', 'L3']

      let newLabels = addRemoveLabels(labels, ['L4', 'L5'], ['L1', 'L3'])

      expect(newLabels).to.deep.equal(['L2', 'L4', 'L5'])
    })
  })
})


