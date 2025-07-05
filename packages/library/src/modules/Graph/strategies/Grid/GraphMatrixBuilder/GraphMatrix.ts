import { getEmptyColumnState } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { isColumnEmpty } from 'modules/Graph/strategies/Grid/utility/isColumnEmpty'

export class GraphMatrix {
  private readonly _matrix = new Map<number, GraphColumnState[]>
  private readonly _graphWidth: number

  constructor(graphWidth: number) {
    this._graphWidth = graphWidth
  }

  public getColumns(rowIndex: number) {
    return this._matrix.get(rowIndex) ?? this.emptyColumnState()
  }

  public setColumns(rowIndex: number, columns: GraphColumnState[]) {
    this._matrix.set(rowIndex, columns)
  }

  public hasRowColumns(rowIndex: number) {
    return this._matrix.has(rowIndex)
  }

  public isColumnBelowEmpty(rowIndex: number, columnIndex: number) {
    return this._matrix.has(rowIndex + 1)
      ? isColumnEmpty(this._matrix.get(rowIndex + 1)![columnIndex])
      : false
  }

  public isColumnAboveEmpty(rowIndex: number, columnIndex: number) {
    return this._matrix.has(rowIndex - 1)
      ? isColumnEmpty(this._matrix.get(rowIndex - 1)![columnIndex])
      : false
  }

  public isColumnAboveBreakPoint(rowIndex: number, columnIndex: number) {
    return this._matrix.has(rowIndex - 1)
      ? this._matrix.get(rowIndex - 1)![columnIndex].isBottomBreakPoint
      : false
  }

  public hasCommitNodeAt(rowIndex: number, columnIndex: number) {
    return this._matrix.has(rowIndex)
      ? this._matrix.get(rowIndex)![columnIndex].isNode
      : false
  }

  public get value() {
    return this._matrix
  }

  private emptyColumnState() {
    return getEmptyColumnState({
      columns: this._graphWidth
    })
  }
}