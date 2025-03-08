import { GitLogEntry } from 'modules/Visualiser'

export interface GitContextBag {
  colours: string[]
  
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
  showBranchesTags: boolean

  /**
   * Whether to show a table of commit metadata
   * on the right-hand side of the graph.
   */
  showGitLog: boolean

  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes: boolean

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