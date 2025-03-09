import { CSSProperties } from 'react'

export interface GitLogVisualiserProps {
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

  /**
   * An array of colours to use for
   * the branches.
   */
  colours?: string[]

  /**
   * The variant of the default colour
   * them to apply to the visualiser.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
   */
  theme?: Theme

  /**
   * Whether to show labels for the nodes
   * that are the tips of branches or
   * tags with the graph.
   */
  showBranchesTags?: boolean

  /**
   * Whether to show a table of commit metadata
   * on the right-hand side of the graph.
   */
  showGitLog?: boolean

  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes?: boolean

  /**
   * Optional padding to add to the container
   * to offset how closely the graph is drawn
   * from the edges.
   */
  padding?: {
    top?: number
    left?: number
  }

  /**
   * CSS Classes to pass to various underlying
   * elements for custom styling.
   */
  classes?: {
    /**
     * A class name passed to the wrapping
     * container (div) around the visualiser.
     *
     * This includes the branches/tags, the
     * graph and the git log table.
     */
    containerClass?: string

    /**
     * A React CSS styling object passed to
     * the wrapping container (div) around
     * the visualiser.
     *
     * This includes the branches/tags, the
     * graph and the git log table.
     */
    containerStyles?: CSSProperties
  }
}

export interface Commit {
  hash: string
  parents: string[]
  refs: string
  branch: string
  message: string
  x: number
  y: number
  date: string
  isBranchTip: boolean
}

export interface GitLogEntry {
  hash: string
  branch: string
  parents: string[]
  refs: string
  message: string
  date: string
}

export const ROW_HEIGHT = 48

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