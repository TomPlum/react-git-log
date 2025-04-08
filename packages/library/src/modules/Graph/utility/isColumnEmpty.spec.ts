import { describe, it, expect } from 'vitest'
import { isColumnEmpty } from './isColumnEmpty'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

describe('isColumnEmpty', () => {
  it('returns true when all non-ignored values are falsy', () => {
    const state: GraphColumnState = {
      isFirstRow: true,  // Should be ignored
      isLastRow: false,  // Should be ignored
      isNode: false,
      isHorizontalLine: false,
      isVerticalLine: false
    }
    expect(isColumnEmpty(state)).toBe(true)
  })

  it('returns false when at least one non-ignored value is truthy', () => {
    const state: GraphColumnState = {
      isFirstRow: true,  // Should be ignored
      isLastRow: false,  // Should be ignored
      isNode: true,  // Non-ignored key with truthy value
      isHorizontalLine: false
    }
    expect(isColumnEmpty(state)).toBe(false)
  })

  it('returns true for an empty object', () => {
    const state: GraphColumnState = {}
    expect(isColumnEmpty(state)).toBe(true)
  })

  it('returns true when all keys in the object are ignored', () => {
    const state: GraphColumnState = {
      isFirstRow: true,
      isLastRow: true
    }
    expect(isColumnEmpty(state)).toBe(true)
  })

  it('returns false when only ignored keys are falsy but a non-ignored key is truthy', () => {
    const state: GraphColumnState = {
      isFirstRow: false,  // Should be ignored
      isLastRow: false,  // Should be ignored
      isNode: false,
      isHorizontalLine: true  // Non-ignored key with truthy value
    }
    expect(isColumnEmpty(state)).toBe(false)
  })

  it('handles an object where all non-ignored values are undefined', () => {
    const state: GraphColumnState = {
      isFirstRow: true,  // Should be ignored
      isLastRow: false,  // Should be ignored
      isNode: undefined,
      isHorizontalLine: undefined
    }
    expect(isColumnEmpty(state)).toBe(true)
  })

  it('handles an undefined object', () => {
    const state = undefined as unknown as GraphColumnState
    expect(isColumnEmpty(state)).toBe(true)
  })
})