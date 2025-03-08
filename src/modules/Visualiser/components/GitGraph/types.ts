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

/**
 * Number of pixels to offset all nodes and
 * lines by so that the graph starts a little
 * from the top of the container.
 */
export const GRAPH_TOP_OFFSET = 30

/**
 * Number of pixels to offset all nodes and
 * lines by so that the graph starts a little
 * from the left of the container.
 */
export const GRAPH_LEFT_OFFSET = 30

/**
 * Number of pixels to offset the top of the
 * table so that the rows line up with the
 * commit nodes in the graph.
 */
export const TABLE_TOP_OFFSET = 8