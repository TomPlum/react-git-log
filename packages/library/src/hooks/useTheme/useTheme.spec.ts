import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'
import * as gitContext from 'context/GitContext/useGitContext'
import * as themeContext from 'context/ThemeContext/useThemeContext'
import { gitContextBag, graphData, themeContextBag } from 'test/stubs'
import { Commit } from 'types/Commit'

describe('useTheme', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('shiftAlphaChannel', () => {
    it('returns the same RGB when opacity is 1 (fully opaque)', () => {
      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 1)
      expect(shiftedColour).toBe('rgb(100, 150, 200)')
    })

    it('returns theme background color when opacity is 0 in dark mode', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'dark'
      }))

      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 0)
      expect(shiftedColour).toBe('rgb(0, 0, 0)' )
    })

    it('correctly blends colors based on opacity in dark mode', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'dark'
      }))

      const { result } = renderHook(useTheme)
      const shiftedColour = result.current.shiftAlphaChannel('rgb(100, 150, 200)', 0.5)
      expect(shiftedColour).toBe('rgb(50, 75, 100)')
    })

    it('correctly blends colors based on opacity in light mode', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
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

  describe('hoverColour', () => {
    it('returns correct hover colour for dark theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'dark'
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.hoverColour).toBe('rgba(70,70,70,0.8)')
    })

    it('returns correct hover colour for light theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'light'
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.hoverColour).toBe('rgba(231, 231, 231, 0.5)')
    })
  })

  describe('textColour', () => {
    it('returns correct text colour for dark theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'dark'
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.textColour).toBe('rgb(255, 255, 255)')
    })

    it('returns correct text colour for light theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'light'
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.textColour).toBe('rgb(0, 0, 0)')
    })
  })

  describe('reduceOpacity', () => {
    it('returns rgba string with given opacity', () => {
      const { result } = renderHook(useTheme)
      expect(result.current.reduceOpacity('rgb(100, 150, 200)', 0.5)).toBe('rgba(100, 150, 200, 0.5)')
    })
  })

  describe('getGraphColumnColour', () => {
    it('returns the correct colour when the index exists in colours array', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['red', 'green', 'blue']
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.getGraphColumnColour(1)).toBe('green')
    })

    it('returns a repeated colour when index is beyond the array length', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['red', 'green', 'blue']
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.getGraphColumnColour(5)).toBe('blue') // 5 % 3 === 2, so should return 'blue'
    })
  })

  describe('getCommitColour', () => {
    it('returns the first column colour for index commit', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['red', 'green', 'blue']
      }))
      const { result } = renderHook(useTheme)
      expect(result.current.getCommitColour({ hash: 'index' } as Commit)).toBe('red')
    })

    it('returns correct column colour based on commit position', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['red', 'green', 'blue']
      }))

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
        gitContextBag({
          graphData: graphData({
            positions: new Map([['abc123', [0, 1]]])
          })
        })
      )

      const { result } = renderHook(useTheme)
      expect(result.current.getCommitColour({ hash: 'abc123' } as Commit)).toBe('green')
    })

    it('logs a warning and returns default black for unmapped commit', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['red', 'green', 'blue']
      }))

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
        gitContextBag({
          graphData: graphData({
            positions: new Map()
          })
        })
      )

      const { result } = renderHook(useTheme)
      expect(result.current.getCommitColour({ hash: 'unknown' } as Commit)).toBe('rgb(0, 0, 0)')
      expect(consoleWarnSpy).toHaveBeenCalledWith('Commit unknown did not have a mapped graph position')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('getTooltipBackground', () => {
    it('returns correctly adjusted background colour for dark theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        colours: ['rgb(100, 150, 200)'],
        theme: 'dark'
      }))

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
        gitContextBag({
          graphData: graphData({
            positions: new Map([['abc123', [0, 0]]])
          })
        })
      )

      const { result } = renderHook(useTheme)
      expect(result.current.getTooltipBackground({ hash: 'abc123' } as Commit)).toBe('rgb(20, 30, 40)')
    })

    it('returns correctly adjusted background colour for light theme', () => {
      vi.spyOn(themeContext, 'useThemeContext').mockReturnValue(themeContextBag({
        theme: 'light',
        colours: ['rgb(100, 150, 200)']
      }))

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
        gitContextBag({
          graphData: graphData({
            positions: new Map([['abc123', [0, 0]]])
          })
        })
      )

      const { result } = renderHook(useTheme)
      expect(result.current.getTooltipBackground({ hash: 'abc123' } as Commit)).toBe('rgb(240, 245, 250)')
    })
  })
})