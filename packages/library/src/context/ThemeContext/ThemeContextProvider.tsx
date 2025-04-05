import { ThemeContext } from 'context/ThemeContext/ThemeContext'
import { PropsWithChildren, useMemo } from 'react'
import { ThemeContextBag, ThemeContextProviderProps } from 'context/ThemeContext/types'
import { neonAuroraDarkColours, neonAuroraLightColours, useTheme } from 'hooks/useTheme'
import { generateRainbowGradient } from 'hooks/useTheme/createRainbowTheme'

export const ThemeContextProvider = ({ children, theme, colours, graphWidth }: PropsWithChildren<ThemeContextProviderProps>) => {

  const { shiftAlphaChannel } = useTheme()

  const themeColours = useMemo<string[]>(() => {
    switch (colours) {
      case 'rainbow-light': {
        return generateRainbowGradient(graphWidth + 1)
      }
      case 'rainbow-dark': {
        return generateRainbowGradient(graphWidth + 1)
          .map(colour => shiftAlphaChannel(colour, 0.6))
      }
      case 'neon-aurora-dark': {
        return neonAuroraDarkColours
      }
      case 'neon-aurora-light': {
        return neonAuroraLightColours
      }
      default: {
        if (theme === 'light') {
          return colours
        }

        return colours.map(colour => shiftAlphaChannel(colour, 0.6))
      }
    }
  }, [colours, graphWidth, shiftAlphaChannel, theme])

  const value = useMemo<ThemeContextBag>(() => ({
    colours: themeColours,
    theme
  }), [theme, themeColours])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}