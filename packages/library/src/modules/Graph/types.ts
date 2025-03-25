import { NodeTheme } from '../../hooks/useTheme'

export interface GraphProps {
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
}