import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { getEmptyColumnState } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'

export class GraphMatrixColumns {
  private readonly _columns: GraphColumnState[]

  constructor(columns: GraphColumnState[]) {
    this._columns = columns
  }

  public static empty(columnQuantity: number) {
    return new GraphMatrixColumns(getEmptyColumnState({
      columns: columnQuantity
    }))
  }

  public update(columnIndex: number, state: GraphColumnState) {
    this._columns[columnIndex] = {
      ...this._columns[columnIndex],
      ...state
    }
  }

  public hasCommitNode(index: number) {
    return this._columns[index].isNode
  }

  public get columns() {
    return this._columns
  }

  public get length() {
    return this._columns.length
  }
}