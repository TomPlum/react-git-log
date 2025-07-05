import { CommitNodeLocation, GraphEdge } from 'data'
import { Commit } from 'types/Commit'
import { GraphMatrixBuilderProps, GraphBreakPointCheck } from './types'
import { GraphEdgeRenderer } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphEdgeRenderer'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'
import { VirtualEdgeRenderer } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/VirtualEdgeRenderer'

export class GraphMatrixBuilder {
  // Maps the one-based row index to an array of column state data
  private readonly _matrix: GraphMatrix

  private readonly _positions: Map<string, CommitNodeLocation>
  private readonly _headCommit: Commit | undefined
  private readonly _isIndexVisible: boolean

  private readonly graphEdgeRenderer: GraphEdgeRenderer
  private readonly virtualEdgeRenderer: VirtualEdgeRenderer

  private readonly columnBreakPointChecks: GraphBreakPointCheck[] = []

  constructor(props: GraphMatrixBuilderProps) {
    this._positions = props.positions
    this._headCommit = props.headCommit
    this._isIndexVisible = props.isIndexVisible
    this._matrix = new GraphMatrix(props.graphWidth)

    this.graphEdgeRenderer = new GraphEdgeRenderer(this._matrix)

    this.virtualEdgeRenderer = new VirtualEdgeRenderer({
      headCommitHash: props.headCommitHash,
      matrix: this._matrix,
      commits: props.commits,
      graphWidth: props.graphWidth,
      positions: props.positions,
      visibleCommits: props.visibleCommits
    })
  }

  public drawEdges(edgeData: GraphEdge[]) {
    edgeData.forEach(({ from, to, rerouted }) => {
      this.graphEdgeRenderer.drawEdge(from, to, rerouted)
    })

    this.columnBreakPointChecks.push(...this.graphEdgeRenderer.columnBreakPointChecks)
  }

  public drawNode(position: CommitNodeLocation) {
    const [row, column] = position
    const columns = this._matrix.getColumns(row)

    const isColumnBelowEmpty = this._matrix.isColumnBelowEmpty(row, column)
    const isColumnAboveBreakPoint = this._matrix.isColumnAboveBreakPoint(row, column)

    columns.update(column, {
      isNode: true,
      isColumnAboveEmpty: this._matrix.isColumnAboveEmpty(row, column),
      isColumnBelowEmpty,
      isTopBreakPoint: isColumnAboveBreakPoint
    })

    this._matrix.setColumns(row, columns)
  }

  /**
   * Updates the matrix to mark certain columns as having
   * break-points after the first node and edge render phases.
   *
   * Such checks are only possible after the initial phases
   * since we need to know about the _positions of all the nodes
   * and their edges after applying pagination and filtering.
   */
  public checkPostRenderBreakPoints() {
    this.columnBreakPointChecks.forEach(({ check, position, location: [rowIndex, columnIndex] }) => {
      const shouldApplyBreakPoint = check(this._matrix)

      if (shouldApplyBreakPoint && this._matrix.hasRowColumns(rowIndex)) {
        this._matrix.getColumns(rowIndex).update(columnIndex, {
          isTopBreakPoint: position === 'top',
          isBottomBreakPoint: position === 'bottom'
        })
      }
    })
  }

  /**
   * Adds the vertical branch lines in from the current branches
   * HEAD commit up to the index pseudo commit node.
   */
  public drawIndexPseudoCommitEdge() {
    if (this._headCommit && this._isIndexVisible && this._positions.has(this._headCommit.hash)) {
      const headCommitRowIndex = this._positions.get(this._headCommit.hash)![0]

      for (let rowIndex = 0; rowIndex <= headCommitRowIndex; rowIndex++) {
        const columnState = this._matrix.getColumns(rowIndex)

        columnState.update(0, {
          isVerticalLine: true,
          isVerticalIndexLine: true
        })
      }
    }
  }

  /**
   * Any commits who have parent hashes that are not present in the graph
   * must have vertical lines drawn from them down to the bottom row to indicate
   * that the parent commit node lies beyond the rows currently shown.
   */
  public drawOffPageVirtualEdges() {
    this.virtualEdgeRenderer.draw()
  }

  /**
   * Marks the first row so it can render with a gradient.
   */
  public markFirstRow(firstVisibleRowIndex: number) {
    const firstRow = this._matrix.getColumns(firstVisibleRowIndex)

    for(let firstRowColumn = 0; firstRowColumn < firstRow.length; firstRowColumn++) {
      firstRow.update(firstRowColumn, {
        isFirstRow: true
      })
    }

    this._matrix.setColumns(firstVisibleRowIndex, firstRow)
  }

  /**
   * Marks the last row so it can render with a gradient.
   */
  public markLastRow(lastVisibleRowIndex: number) {
    const lastRow = this._matrix.getColumns(lastVisibleRowIndex)
    for(let lastRowColumn = 0; lastRowColumn < lastRow.length; lastRowColumn++) {
      lastRow.update(lastRowColumn, {
        isLastRow: true
      })
    }

    this._matrix.setColumns(lastVisibleRowIndex, lastRow)
  }

  public get matrix() {
    return this._matrix
  }

  public get virtualColumns() {
    return this.virtualEdgeRenderer.virtualColumns
  }
}