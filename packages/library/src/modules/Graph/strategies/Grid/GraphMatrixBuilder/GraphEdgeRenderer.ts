import { CommitNodeLocation } from 'data'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'
import { GraphBreakPointCheck } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/types'
import { BranchingEdgeRenderer } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/BranchingEdgeRenderer'

export class GraphEdgeRenderer {
  private readonly _matrix: GraphMatrix
  private readonly _columnBreakPointChecks: GraphBreakPointCheck[] = []

  constructor(matrix: GraphMatrix) {
    this._matrix = matrix
  }

  public drawEdge(from: CommitNodeLocation, to: CommitNodeLocation, rerouted: boolean) {
    const [rowStart, colStart] = from
    const [rowEnd, colEnd] = to

    if (colStart === colEnd) {
      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      this.drawCommitEdges(rowStart, rowEnd, colStart, rerouted)
    } else {
      // Are we connecting nodes in different columns?
      // I.e. drawing a line that ultimately curves into another column
      // to represent a new branch being created or a branch being merged.
      this.drawBranchingAndMergingEdges(from, to, rerouted)
    }
  }

  private drawCommitEdges(rowStart: number, rowEnd: number, column: number, rerouted: boolean) {
    for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
      const columns = this._matrix.getColumns(targetRow)
      const isBottomBreakPoint = targetRow === rowEnd - 1 && rerouted

      columns.update(column, {
        isVerticalLine: true,
        isBottomBreakPoint
      })

      this._matrix.setColumns(targetRow, columns)
    }
  }

  private drawBranchingAndMergingEdges(from: CommitNodeLocation, to: CommitNodeLocation, rerouted: boolean) {
    const [rowStart, colStart] = from
    const [rowEnd, colEnd] = to

    for (let currentRow = rowStart; currentRow <= rowEnd; currentRow++) {
      const columns = this._matrix.getColumns(currentRow)

      const branchingEdge = new BranchingEdgeRenderer({
        columns,
        rerouted,
        currentRow,
        targetRow: rowEnd,
        targetColumn: colEnd,
        sourceColumn: colStart,
      })

      const isTargetNodeBelowSource = rowEnd > rowStart
      const isTargetNodeLeftOfSource = colEnd < colStart
      const isDrawingDownLeft = isTargetNodeBelowSource && isTargetNodeLeftOfSource

      // We're drawing a merge line from the bottom of
      // a commit node, down, then to the left.
      if (isDrawingDownLeft) {
        if (currentRow === rowStart) {
          // For the first row, add a vertical merge line
          // out the bottom of the commit node.
          columns.update(colStart, {
            isVerticalLine: true
          })
        } else if (currentRow === rowEnd) {
          // Add the curved line into the column that we're starting
          // from (the commit nodes), and draw to the left towards our
          // target node.
          const { breakPointChecks } = branchingEdge.drawLeftHorizontalLineAndCurve()
          this._columnBreakPointChecks.push(...breakPointChecks)
        } else {
          // We're past the first row now, so draw
          // vertical straight lines down up until
          // before we reach the target row since we'll
          // have a curved line their around the corner.
          columns.update(colStart, {
            isVerticalLine: true,
            isBottomBreakPoint: rerouted && currentRow === rowEnd - 1
          })
        }
      } else if (currentRow === rowStart) {
        // Since we're not going down and to the left, we must be going right, then down.
        // So draw horizontal straight lines in all but the target column
        // since that one will be a curved line.
        branchingEdge.drawRightHorizontalLineAndCurve()
      } else {
        // We're drawing an edge right from the source node,
        // then down to the target node. We've already drawn the
        // horizontal lines and the curve, so finish off by drawing
        // vertical lines straight down from the second row to the
        // target node.
        columns.update(colEnd, {
          isVerticalLine: true,
          isBottomBreakPoint: rerouted && currentRow === rowEnd - 1
        })
      }

      this._matrix.setColumns(currentRow, columns)
    }
  }

  public get columnBreakPointChecks() {
    return this._columnBreakPointChecks
  }
}