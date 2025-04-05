import { ThemeColours, ThemeMode } from 'hooks/useTheme'

export interface ThemeContextBag {
  /**
   * The variant of the default colour
   * them to apply to the log.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
   */
  theme: ThemeMode

  /**
   * An array of colours to be used in
   * graph to denote the different branches
   * in the git log entries.
   */
  colours: string[]
}

export interface ThemeContextProviderProps {
  theme: ThemeMode
  graphWidth: number
  colours: ThemeColours | string[]
}