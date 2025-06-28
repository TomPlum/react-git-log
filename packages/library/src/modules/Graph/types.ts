import { NodeTheme } from '../../hooks/useTheme'
import { CustomCommitNode } from './strategies/Grid/types'

export type GraphOrientation = 'normal' | 'flipped'

export type Canvas2DGraphProps = GraphPropsCommon

export interface HTMLGridGraphProps<T> extends GraphPropsCommon {
  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes?: boolean

  /**
   * Whether to show tooltips when hovering
   * over a commit node in the graph.
   */
  showCommitNodeTooltips?: boolean

  /**
   * Overrides the commit nodes with a
   * custom implementation.
   */
  node?: CustomCommitNode<T>

  /**
   * The height, in pixels, of the background
   * colour of a row that is being previewed
   * or has been selected.
   *
   * You probably only want to set this if
   * you have passed a custom row implementation
   * into the table component that has a different
   * height from the default.
   */
  highlightedBackgroundHeight?: number
}

export interface GraphPropsCommon {
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
   * left to right, so the checked-out
   * branch is on the left-hand side.
   *
   * Flipped mode inverts the graph
   * in the y-axios so it's drawn from
   * right to left with the checked-out
   * branch on the right-hand side.
   */
  orientation?: GraphOrientation
}