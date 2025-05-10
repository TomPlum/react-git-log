import { getColumnBackgroundSize } from './getColumnBackgroundSize'

describe('getColumnBackgroundSize', () => {
  it('should return the correct column background size if the nodeSize is less than 16', () => {
    const columnBackgroundSize = getColumnBackgroundSize({ nodeSize: 15 })
    expect(columnBackgroundSize).toBe(12)
  })

  it('should return the correct column background size if the nodeSize is 16', () => {
    const columnBackgroundSize = getColumnBackgroundSize({ nodeSize: 16 })
    expect(columnBackgroundSize).toBe(12)
  })

  it('should return the correct column background size if the nodeSize is greater than 16', () => {
    const columnBackgroundSize = getColumnBackgroundSize({ nodeSize: 17 })
    expect(columnBackgroundSize).toBe(16)
  })
})