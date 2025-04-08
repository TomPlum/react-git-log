import { NodeTheme } from 'hooks/useTheme'

export type GraphOrientation = 'normal' | 'flipped'

export type Canvas2DGraphProps = GraphPropsCommon

export interface HTMLGridGraphProps extends GraphPropsCommon {
  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes?: boolean
}

interface GraphPropsCommon {
  /**
   * Whether to show tooltips when hovering
   * over a commit node in the graph.
   */
  showCommitNodeTooltips?: boolean

  /**
   * The theme to apply the commit node
   * elements in the graph.
   */
  nodeTheme?: NodeTheme

  /**
   * Enables the graphs horizontal width
   * to be resized.
   *
   * @default false
   */
  enableResize?: boolean

  /**
   * The diameter, in pixels, of the
   * commit node elements rendered on
   * the graph.
   */
  nodeSize?: number

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
  orientation?: GraphOrientation
}