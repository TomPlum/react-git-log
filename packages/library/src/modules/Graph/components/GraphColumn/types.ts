import { Commit } from 'types/Commit'

export interface GraphColumnProps {
  /**
   * The zero-based index of this column
   * in its row.
   */
  index: number

  /**
   * The index of the row in which this
   * column belongs to.
   */
  rowIndex: number

  /**
   * Details of the commit that is present
   * somewhere on the row that this column
   * is present in.
   */
  commit: Commit

  /**
   * Details about what is present
   * in this column.
   */
  state: GraphColumnState

  /**
   * The column index of the commit node
   * in the row that this column sits in.
   */
  commitNodeIndex: number
}

export interface GraphColumnState {
  /**
   * Indicates that this column contains
   * a commit node.
   */
  isNode?: boolean

  /**
   * Indicates that this column contains
   * a horizontal line that spans the full
   * width of the column to connect two
   * nodes via branching or merging.
   */
  isHorizontalLine?: boolean

  /**
   * Indicates that this column contains
   * a vertical line that spans the full
   * height of the column to connect two
   * nodes via branching or merging.
   */
  isVerticalLine?: boolean

  /**
   * Indicates that this column contains
   * a vertical dotted line that spans the full
   * height of the column to connect the HEAD
   * node of the current branch to the
   * pseudo index commit node of the git index.
   */
  isVerticalIndexLine?: boolean

  /**
   * The graph row column indices of the commit
   * nodes that a merge came from.
   *
   * This will only be populated for columns that
   * have commit nodes in. Multiple numbers indicate
   * that multiple other nodes merge into this one.
   */
  mergeSourceColumns?: number[]

  /**
   * Indicates that the column in the row above
   * the one that this column resides in is empty.
   * Which it to say it contains now graphical elements
   * such as nodes or lines.
   *
   * This indicates that the commit node in this column
   * has no parent commit in the row above (visually).
   */
  isColumnAboveEmpty?: boolean

  /**
   * Indicates that the column in the row below
   * the one that this column resides in is empty.
   * Which it to say it contains now graphical elements
   * such as nodes or lines.
   *
   * This indicates that the commit node in this column
   * has no child commit in the row below (visually).
   */
  isColumnBelowEmpty?: boolean

  /**
   * Indicates that this column contains
   * a curved line that starts at the
   * middle of the left edge of the column
   * and stops at the middle of the bottom
   * edge of the column.
   */
  isLeftDownCurve?: boolean

  /**
   * Indicates that this column contains
   * a curved line that starts at the
   * middle of the left edge of the column
   * and stops at the middle of the top
   * edge of the column.
   */
  isLeftUpCurve?: boolean

  /**
   * Indicates that the elements in this
   * column (whether they be lines or a node)
   * are part of a skeleton placeholder to
   * indicate that there is currently no data
   * to show on the graph based on current
   * filtering.
   */
  isPlaceholderSkeleton?: boolean
}