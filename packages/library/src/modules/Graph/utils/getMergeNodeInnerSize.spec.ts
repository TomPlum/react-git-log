import { getMergeNodeInnerSize } from 'modules/Graph/utils/getMergeNodeInnerSize'

describe('getMergeNodeInnerSize', () => {
  it('should return the correct diameter for a nodeSize greater than 10', () => {
    const diameter = getMergeNodeInnerSize({ nodeSize: 11 })
    expect(diameter).to.equal(5)
  })

  it('should return the correct diameter for a nodeSize less than 10', () => {
    const diameter = getMergeNodeInnerSize({ nodeSize: 9 })
    expect(diameter).to.equal(7)
  })

  it('should return the correct diameter for a nodeSize equal to 10', () => {
    const diameter = getMergeNodeInnerSize({ nodeSize: 10 })
    expect(diameter).to.equal(8)
  })
})