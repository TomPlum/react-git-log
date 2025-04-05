import { useGitContext } from 'context/GitContext'
import { ThemeFunctions } from './types'
import { useCallback, useMemo } from 'react'
import { Commit } from 'types/Commit'
import { useThemeContext } from 'context/ThemeContext'

export const useTheme = (): ThemeFunctions => {
  const { graphData } = useGitContext()
  const { theme, colours } = useThemeContext()

  const hoverColour = useMemo(() => {
    if (theme === 'dark') {
      return 'rgba(70,70,70,0.8)'
    }

    return 'rgba(231, 231, 231, 0.5)'
  }, [theme])

  const textColour = useMemo(() => {
    if (theme === 'dark') {
      return 'rgb(255, 255, 255)'
    }

    return 'rgb(0, 0, 0)'
  }, [theme])

  const shiftAlphaChannel = useCallback((rgb: string, opacity: number) => {
    const matches = rgb?.match(/\d+/g)

    if (rgb && matches != null) {
      const [r_fg, g_fg, b_fg] = matches.map(Number)
      const backgroundRgb = theme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
      const [r_bg, g_bg, b_bg] = backgroundRgb.match(/\d+/g)!.map(Number)

      const r_new = Math.round(r_fg * opacity + r_bg * (1 - opacity))
      const g_new = Math.round(g_fg * opacity + g_bg * (1 - opacity))
      const b_new = Math.round(b_fg * opacity + b_bg * (1 - opacity))

      return `rgb(${r_new}, ${g_new}, ${b_new})`
    }

    return rgb
  }, [theme])

  const reduceOpacity = useCallback((rgb: string, opacity: number) => {
    return `rgba(${rgb?.replace('rgb(', '').replace(')', '')}, ${opacity})`
  }, [])

  const getGraphColumnColour = useCallback((columnIndex: number) => {
    const colour = colours[columnIndex]

    if (!colour) {
      return colours[columnIndex % colours.length]
    }

    return colour
  }, [colours])

  const getCommitColour = useCallback((commit: Commit) => {
    if (commit.hash === 'index') {
      return getGraphColumnColour(0)
    }

    const position = graphData.positions.get(commit.hash)

    if (position) {
      const columnIndex = position[1]
      return getGraphColumnColour(columnIndex)
    }

    console.warn(`Commit ${commit.hash} did not have a mapped graph position`)
    return 'rgb(0, 0, 0)'
  }, [getGraphColumnColour, graphData.positions])

  const getTooltipBackground = useCallback((commit: Commit) => {
    if (theme === 'dark') {
      return shiftAlphaChannel(getCommitColour(commit), 0.2)
    }

    return shiftAlphaChannel(getCommitColour(commit), 0.1)
  }, [getCommitColour, shiftAlphaChannel, theme])

  return {
    theme,
    hoverColour,
    textColour,
    getTooltipBackground,
    reduceOpacity,
    getCommitColour,
    shiftAlphaChannel,
    getGraphColumnColour,
    hoverTransitionDuration: 0.3
  }
}