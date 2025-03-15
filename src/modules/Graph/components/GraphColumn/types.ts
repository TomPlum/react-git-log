import { Commit } from 'modules/Visualiser'

export interface GraphColumnProps {
  /**
   * The zero-based index of this column
   * in its row.
   */
  index: number

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
  isNode?: boolean
  isHorizontalLine?: boolean
  mergeSourceNodeColumnIndex?: number
  isLeftDownCurve?: boolean
  isLeftUpCurve?: boolean
  isVerticalLine?: boolean
  isVerticalIndexLine?: boolean
}