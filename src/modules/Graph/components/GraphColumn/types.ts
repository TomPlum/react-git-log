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
   *
   * An undefined commit means we must be
   * referencing the index.
   */
  commit?: Commit

  /**
   * Details about what is present
   * in this column.
   */
  state: GraphColumnState
}

export interface GraphColumnState {
  isNode?: boolean
  isHorizontalLine?: boolean
  isLeftDownCurve?: boolean
  isLeftUpCurve?: boolean
  isVerticalMergeLine?: boolean
}