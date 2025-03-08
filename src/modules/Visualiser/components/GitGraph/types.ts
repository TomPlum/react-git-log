import { GitLogEntry } from '../../types.ts'

export interface GitGraphProps {
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

  /**
   * Whether to show labels for the nodes
   * that are the tips of branches or
   * tags with the graph.
   */
  showBranchesTags?: boolean

  showGitLog?: boolean

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