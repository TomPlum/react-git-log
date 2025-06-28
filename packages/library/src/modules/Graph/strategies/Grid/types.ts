import { ReactElement } from 'react'
import { Commit } from 'types/Commit'

/**
 * A function that returns a custom implementation
 * for the commit node in the graph.
 */
export type CustomCommitNode<T> = (props: CustomCommitNodeProps<T>) => ReactElement

export interface CustomCommitNodeProps<T> {
  /**
   * Details of the commit that this node
   * represents.
   */
  commit: Commit<T>

  /**
   * The colour of the node based on the
   * column that it sits in and any theming.
   */
  colour: string

  /**
   * The zero-based index of the row that
   * this node sits in.
   */
  rowIndex: number

  /**
   * The zero-based index of the column that
   * this node sits in.
   */
  columnIndex: number

  /**
   * The diameter, in pixels, of the
   * commit node. This value is the same
   * as the nodeSize property passed into
   * the graph component.
   */
  nodeSize: number

  /**
   * Denotes whether this node is the
   * "pseudo-node" that is rendered at the
   * top of the graph above the HEAD commit
   * if it is visible based on the current
   * pagination.
   */
  isIndexPseudoNode: boolean
}