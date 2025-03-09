import { useGitContext } from 'modules/Visualiser/context'
import { ThemeColours } from './types'
import { useMemo } from 'react'

export const useTheme = (): ThemeColours => {
  const { theme } = useGitContext()

  const hoverColour = useMemo(() => {
    if (theme === 'dark') {
      return 'rgba(70,70,70,0.8)'
    }

    return 'rgba(231, 231, 231, 0.5)'
  }, [theme])

  const textColour = useMemo(() => {
    if (theme === 'dark') {
      return 'white'
    }

    return 'black'
  }, [theme])

  return {
    hoverColour,
    textColour
  }
}