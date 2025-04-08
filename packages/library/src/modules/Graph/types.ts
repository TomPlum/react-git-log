import { NodeTheme } from '../../hooks/useTheme'

export type GraphOrientation = 'normal' | 'flipped'

export type GraphRenderStrategy = 'html-dom' | 'html-canvas'

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

  /**
   * Determines how the graph is rendered.
   *
   * HTML DOM mode renders the graph using
   * styled divs and SVG elements for the
   * curved lines. This uses a grid system
   * to make it look like a complete graph.
   * This strategy is less performant as its
   * heavier on the DOM, but is easier to
   * programmatically test and assert on via
   * attributes on each row, column and its
   * contents.
   *
   * HTML Canvas mode uses a flat 2D HTML
   * canvas element. This strategy is more
   * performant, but harder to test and not
   * as feature rich.
   */
  renderStrategy?: GraphRenderStrategy
}