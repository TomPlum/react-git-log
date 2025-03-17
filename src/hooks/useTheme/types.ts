import { Commit } from 'modules/Visualiser'

export interface ThemeColours {
  theme: Theme
  hoverColour: string
  textColour: string
  getTooltipBackground: (commit: Commit) => string
  hoverTransitionDuration: number

  /**
   * Blends an RGB color with a background color to simulate an alpha effect.
   *
   * This function adjusts the given RGB color as if it were semi-transparent over a background,
   * without actually using an alpha channel. The result is a new solid RGB color that appears
   * visually similar to an `rgba()` color with transparency.
   *
   * @param rgb - The colour to shift in `rgb(r, g, b)` format.
   * @param opacity - The simulated alpha channel (range: `0` to `1`).
   * @returns The blended color in `rgb(r, g, b)` format.
   *
   * @example
   * ```ts
   * blendColorWithBackground('rgb(100, 200, 255)', 0.5) // "rgb(50, 100, 128)" (darker blue)
   * blendColorWithBackground('rgb(100, 200, 255)', 0.5) // "rgb(178, 228, 255)" (lighter blue)
   * ```
   */
  shiftAlphaChannel: (rgb: string, opacity: number) => string

  /**
   * Reduces the opacity of the given RGB colour string.
   *
   * @param rbg The colour to reduce the opacity of. Must be in rgb(x, y, z) format.
   * @param opacity The desired opacity value from 0 to 1.
   */
  reduceOpacity: (rbg: string, opacity: number) => string

  getCommitColour: (commit: Commit) => string

  getGraphColumnColour: (columnIndex: number) => string
}

export type Theme = 'dark' | 'light'

export const darkThemeColors = [
  'rgb(33, 150, 243)',  // Bright blue
  'rgb(25, 118, 210)',  // Deep blue
  'rgb(21, 101, 192)',  // Darker blue
  'rgb(98, 0, 234)',    // Vivid purple
  'rgb(123, 31, 162)',  // Deep purple
  'rgb(94, 53, 177)',   // Muted purple
  'rgb(0, 230, 118)',   // Neon green
  'rgb(0, 200, 83)',    // Darker neon green
  'rgb(46, 125, 50)',   // Forest green
  'rgb(0, 77, 64)'      // Teal green
]

export const lightThemeColors = [
  'rgb(100, 181, 246)', // Light blue
  'rgb(66, 165, 245)',  // Sky blue
  'rgb(41, 182, 246)',  // Bright cyan-blue
  'rgb(186, 104, 200)', // Soft purple
  'rgb(156, 39, 176)',  // Vibrant purple
  'rgb(171, 71, 188)',  // Medium purple
  'rgb(102, 187, 106)', // Fresh green
  'rgb(67, 160, 71)',   // Leaf green
  'rgb(129, 199, 132)', // Pastel green
  'rgb(77, 182, 172)'   // Soft teal
]