import { GraphMatrixColumns } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrixColumns'
import { GraphBreakPointCheck } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/types'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'

interface BranchingEdgeRendererProps {
  /**
   * The columns belonging to the row
   * at index {@link targetRow}.
   */
  columns: GraphMatrixColumns

  /**
   * The index of the column that the source
   * commit node is in. This is the node that
   * we're drawing the edge from.
   */
  sourceColumn: number

  /**
   * The index of the column that the target
   * commit node is in. This is the node that
   * we're drawing the edge to in {@link targetRow}.
   */
  targetColumn: number

  /**
   * The index of the row that the target
   * commit node is in. This is the node
   * that we're drawing the edge to.
   */
  targetRow: number

  /**
   * The index of the row that we're currently
   * evaluating in the {@link GraphEdgeRenderer}
   * when drawing branching edges.
   */
  currentRow: number

  /**
   * Denotes whether this edge has
   * been rerouted from its actual
   * target node to its nearest ancestor
   * based on commits being filtered
   * from the graph.
   */
  rerouted: boolean
}

export class BranchingEdgeRenderer {
  private readonly _columns: GraphMatrixColumns

  private readonly _sourceColumn: number
  private readonly _targetColumn: number

  private readonly _currentRow: number
  private readonly _targetRow: number

  private readonly _rerouted: boolean

  constructor(props: BranchingEdgeRendererProps) {
    this._columns = props.columns
    this._sourceColumn = props.sourceColumn
    this._targetColumn = props.targetColumn
    this._rerouted = props.rerouted
    this._currentRow = props.currentRow
    this._targetRow = props.targetRow
  }

  public drawLeftHorizontalLineAndCurve() {
    const breakPointChecks: GraphBreakPointCheck[] = []

    this._columns.update(this._sourceColumn, {
      isLeftUpCurve: true
    })

    // Since we draw the edges first, we can't check if
    // the column above has a node or not. We can't tell if we
    // need a top break-point, so we'll add it to the list
    // to check afterwards.
    if (this._rerouted) {
      breakPointChecks.push({
        location: [this._currentRow, this._sourceColumn],
        position: 'top',
        check: (matrix: GraphMatrix) => {
          return !matrix.hasCommitNodeAt(
            this._currentRow - 1,
            this._sourceColumn
          )
        }
      })
    }

    // For the remaining columns in this final row, draw
    // horizontal lines towards the target commit node.
    for (let columnIndex = this._sourceColumn - 1; columnIndex >= this._targetColumn; columnIndex--) {
      this._columns.update(columnIndex, {
        isHorizontalLine: true,
        mergeSourceColumns: [
          ...(this._columns.columns[columnIndex]?.mergeSourceColumns ?? []),
          this._sourceColumn
        ]
      })
    }

    return {
      breakPointChecks
    }
  }

  public drawRightHorizontalLineAndCurve() {
    for (let columnIndex = this._sourceColumn; columnIndex < this._targetColumn; columnIndex++) {
      this._columns.update(columnIndex, {
        isHorizontalLine: true,
        mergeSourceColumns: [
          ...(this._columns.columns[columnIndex]?.mergeSourceColumns ?? []),
          this._targetColumn
        ]
      })
    }


    const isTargetRow = this._currentRow === this._targetRow
    const isBottomBreakPoint = this._rerouted && isTargetRow && this._columns.hasCommitNode(this._sourceColumn)

    // Add in the curved line in the target column where the end node is
    this._columns.update(this._targetColumn, {
      isLeftDownCurve: true,
      isBottomBreakPoint
    })
  }
}