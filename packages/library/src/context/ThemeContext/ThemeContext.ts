import { createContext } from 'react'
import { ThemeContextBag } from 'context/ThemeContext/types'
import { neonAuroraDarkColours } from 'hooks/useTheme'

export const ThemeContext = createContext<ThemeContextBag>({
  colours: neonAuroraDarkColours,
  theme: 'light'
})