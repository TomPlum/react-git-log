import { useGitContext } from 'modules/Visualiser/context'
import { ThemeColours } from './types'
import { useCallback, useMemo } from 'react'
import { Commit } from 'modules/Visualiser'

export const useTheme = (): ThemeColours => {
  const { theme, colours } = useGitContext()

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

  const tooltipBackground = useMemo(() => {
    if (theme === 'dark') {
      return 'rgb(87,87,87)'
    }

    return 'rgb(213,213,213)'
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

  const getCommitColour = useCallback((commit: Commit) => {
    const index = commit.x
    const colour = colours[index]

    if (!colour) {
      return colours[index % colours.length]
    }

    return colour
  }, [colours])

  return {
    hoverColour,
    textColour,
    tooltipBackground,
    reduceOpacity,
    getCommitColour,
    shiftAlphaChannel,
    hoverTransitionDuration: 0.3
  }
}