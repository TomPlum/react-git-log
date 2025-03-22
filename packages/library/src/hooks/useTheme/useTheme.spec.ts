import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'
import * as gitContext from 'context/GitContext/useGitContext'
import { gitContextBag } from 'test/stubs'

describe('useTheme', () => {
  describe('shiftAlphaChannel', () => {
    it('returns the same RGB when opacity is 1 (fully opaque)', () => {
      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 1)
      expect(shiftedColour).toBe('rgb(100, 150, 200)')
    })

    it('returns theme background color when opacity is 0 in dark mode', () => {
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        theme: 'dark'
      }))

      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 0)
      expect(shiftedColour).toBe('rgb(0, 0, 0)' )
    })

    it('correctly blends colors based on opacity in dark mode', () => {
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        theme: 'dark'
      }))

      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 0.5)
      expect(shiftedColour).toBe('rgb(50, 75, 100)')
    })

    it('correctly blends colors based on opacity in light mode', () => {
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        theme: 'light'
      }))

      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 0.5)
      expect(shiftedColour).toBe('rgb(178, 203, 228)')
    })

    it('returns original value if input is not a valid RGB string', () => {
      const { result } = renderHook(useTheme)
      expect(result.current.shiftAlphaChannel('invalid', 0.5)).toBe('invalid')
      expect(result.current.shiftAlphaChannel('', 0.5)).toBe('')
    })

    it('returns original value if RGB input is null or undefined', () => {
      const { result } = renderHook(useTheme)
      expect(result.current.shiftAlphaChannel(null as unknown as string, 0.5)).toBeNull()
      expect(result.current.shiftAlphaChannel(undefined as unknown as string, 0.5)).toBeUndefined()
    })
  })
})