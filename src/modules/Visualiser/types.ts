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