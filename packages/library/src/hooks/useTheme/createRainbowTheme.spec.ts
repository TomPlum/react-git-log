import { describe, it, expect } from 'vitest'
import { generateRainbowGradient } from './createRainbowTheme'

describe('generateRainbowGradient', () => {
  it('returns an empty array when n is less than 1', () => {
    expect(generateRainbowGradient(0)).toEqual([])
    expect(generateRainbowGradient(-5)).toEqual([])
  })

  it('returns a single color when n is 1', () => {
    const result = generateRainbowGradient(1)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe('rgb(54,229,234)')
  })

  it('returns an array of n colors when n > 1', () => {
    const n = 5
    const result = generateRainbowGradient(n)
    expect(result).toHaveLength(n)
    result.forEach(color => {
      expect(color).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
    })
  })

  it('returns a smooth gradient where first and last colors are distinct', () => {
    const n = 10
    const result = generateRainbowGradient(n)
    expect(result[0]).not.toBe(result[result.length - 1])
  })

  it('returns distinct colors for a large n', () => {
    const n = 100
    const result = generateRainbowGradient(n)
    const uniqueColors = new Set(result)
    expect(uniqueColors.size).toBeGreaterThan(90) // Most should be unique
  })
})