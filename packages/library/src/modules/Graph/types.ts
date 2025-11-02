import { BreakPointTheme, NodeTheme } from '../../hooks/useTheme'
import { CustomCommitNode } from './strategies/Grid/types'
import { ReactElement } from 'react'
import { Commit } from '../../types/Commit'

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
export type GraphOrientation = 'normal' | 'flipped'

export interface CustomTooltipProps {
  /**
   * Details of the commit that is
   * being hovered over.
   */
  commit: Commit

  /**
   * The brighter, border colour of the commit based on
   * the current theme that is applied.
   */
  borderColour: string

  /**
   * The darker, background colour of the commit based on
   * the current theme that is applied.
   */
  backgroundColour: string
}

/**
 * Overrides the graph node tooltip with
 * a custom implementation. Commit metadata
 * is injected into the function for you to
 * render.
 */
export type CustomTooltip = (props: CustomTooltipProps) => ReactElement<HTMLElement>

export type Canvas2DGraphProps = GraphPropsCommon

export interface HTMLGridGraphProps<T = unknown> extends GraphPropsCommon {
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

  /**
   * Overrides the graph node tooltip with
   * a custom implementation. Commit metadata
   * is injected into the function for you to
   * render.
   */
  tooltip?: CustomTooltip
}

export interface GraphPropsCommon {
  /**
   * The theme to apply the commit node
   * elements in the graph.
   */
  nodeTheme?: NodeTheme

  /**
   * Determines how the breakpoints (the styling of
   * the node edges in the graph if a filter is active
   * and is causing breaks in the graph) are rendered.
   */
  breakPointTheme?: BreakPointTheme

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