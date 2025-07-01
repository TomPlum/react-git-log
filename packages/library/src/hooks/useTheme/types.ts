import { Commit } from 'types/Commit'

export interface ThemeFunctions {
  /**
   * The current active theme mode.
   * @example light, dark
   */
  theme: ThemeMode

  /**
   * An rgb() colour string for
   * text that is being hovered over
   * relative to the currently active
   * {@link theme}.
   */
  hoverColour: string

  /**
   * An rgb() colour string for
   * text relative to the currently
   * active {@link theme}.
   */
  textColour: string

  /**
   * An rgb() colour string for
   * background of a tooltip relative
   * to the currently active {@link theme}.
   */
  getTooltipBackground: (commit: Commit) => string

  /**
   * The duration, in milliseconds, of
   * the animation for hover transition
   * effects.
   */
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

  /**
   * Gets an rgb() colour string for the
   * given {@link Commit} relative to the
   * given colours of the git log.
   *
   * @param commit The commit to get the colour for.
   */
  getCommitColour: (commit: Commit) => string

  /**
   * Gets an rgb() colour string for the
   * given column index relative to the
   * given colours of the git log.
   *
   * @param columnIndex The index to get the colour for.
   */
  getGraphColumnColour: (columnIndex: number) => string

  /**
   * Gets rgb() colour strings for styling a commit node
   * from the given base column colour.
   *
   * @param args Args to get the colour.
   */
  getCommitNodeColours: (args: GetCommitNodeColoursArgs) => CommitNodeColours

  /**
   * Gets an rgb() colour string for the background
   * colour of a graph column when its row is selected.
   *
   * @param columnIndex The index of the column where the node is.
   */
  getGraphColumnSelectedBackgroundColour: (columnIndex: number) => string
}

export interface GetCommitNodeColoursArgs {
  columnColour: string
}

export interface CommitNodeColours {
  backgroundColour: string
  borderColour: string
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

/**
 * Determines how the breakpoints (the styling of
 * the node edges in the graph if a filter is active
 * and is causing breaks in the graph) are rendered.
 */
export type BreakPointTheme = 'slash' | 'dot' | 'zig-zag'

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