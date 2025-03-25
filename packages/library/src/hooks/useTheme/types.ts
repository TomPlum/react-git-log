import { Commit } from 'types/Commit'

export interface ThemeFunctions {
  theme: ThemeMode
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

export type ThemeMode = 'light' | 'dark'

/**
 * The default theme renders merge nodes
 * with a different theme to make them
 * more distinct from regular commits.
 *
 * The plain theme renders all nodes
 * (except the index pseudo-node) the same.
 */
export type NodeTheme = 'default' | 'plain'

export type ThemeColours =
  'rainbow-dark' |
  'rainbow-light' |
  'neon-aurora-dark' |
  'neon-aurora-light'

export const neonAuroraDarkColours = [
  'rgb(0, 255, 128)',   // Neon green
  'rgb(41, 121, 255)',  // Electric blue
  'rgb(201, 81, 238)',  // Pink
  'rgb(255, 160, 0)',   // Amber
  'rgb(0, 184, 212)',   // Dark cyan
  'rgb(103, 58, 183)',  // Royal violet
  'rgb(224,33,70)',   // Red
  'rgb(0, 121, 107)',   // Teal storm
  'rgb(255, 193, 7)',   // Solar gold
]

export const neonAuroraLightColours = [
  'rgb(0, 200, 83)',   // Bright green
  'rgb(25, 118, 210)', // Medium blue
  'rgb(244, 143, 177)', // Soft pink
  'rgb(255, 193, 7)',  // Golden amber
  'rgb(3, 169, 244)',  // Sky blue
  'rgb(156, 39, 176)', // Vibrant violet
  'rgb(229, 57, 53)',  // Warm red
  'rgb(0, 137, 123)',  // Ocean teal
  'rgb(255, 160, 0)',  // Deep yellow-orange
]