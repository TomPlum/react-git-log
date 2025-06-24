import { NodeTheme } from 'hooks/useTheme'
import { GraphOrientation } from 'modules/Graph'
import { Commit } from 'types/Commit'
import { RowIndexToColumnStates } from 'modules/Graph/strategies/Grid/hooks/useColumnData'
import { CustomCommitNode } from 'modules/Graph/strategies/Grid'

export interface GraphContextBag {
  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes: boolean

  /**
   * Whether to show tooltips when hovering
   * over a commit node in the graph.
   */
  showCommitNodeTooltips: boolean

  /**
   * A custom commit node implementation.
   */
  node?: CustomCommitNode

  /**
   * The height, in pixels, of the background
   * colour of a row that is being previewed
   * or has been selected.
   */
  highlightedBackgroundHeight?: number

  /**
   * The theme to apply the commit node
   * elements in the graph.
   */
  nodeTheme: NodeTheme

  /**
   * The diameter, in pixels, of the
   * commit node elements rendered on
   * the graph.
   */
  nodeSize: number

  /**
   * The width of the graph. A number
   * that is the maximum concurrent active
   * branches at any one time from all
   * git log entries passed the log.
   */
  graphWidth: number

  /**
   * The orientation of the graph.
   *
   * Normal mode draws the graph from
   * left to right so the checked-out
   * branch is on the left-hand side.
   *
   * Flipped mode inverts the graph
   * in the y-axios so it's drawn from
   * right to left with the checked-out
   * branch on the right-hand side.
   */
  orientation: GraphOrientation

  /**
   * The commits that are currently being
   * rendered on the graph relative to the
   * pagination configuration.
   */
  visibleCommits: Commit[]

  /**
   * A map of row indices to their
   * respective column states.
   */
  columnData: RowIndexToColumnStates
}