import { CommitNodeLocation } from 'data'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'
import { GraphBreakPointCheck } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/types'

export class GraphEdgeRenderer {
  private readonly _matrix: GraphMatrix
  private readonly _columnBreakPointChecks: GraphBreakPointCheck[] = []

  constructor(matrix: GraphMatrix) {
    this._matrix = matrix
  }

  public drawEdge(from: CommitNodeLocation, to: CommitNodeLocation, rerouted: boolean) {
    const [rowStart, colStart] = from
    const [rowEnd, colEnd] = to

    // Are we connecting to nodes in the same column?
    // I.e. drawing a straight merge line between them.
    if (colStart === colEnd) {
      for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
        const columnState = this._matrix.getColumns(targetRow)

        columnState[colStart] = {
          ...columnState[colStart],
          isVerticalLine: true,
          isBottomBreakPoint: targetRow === rowEnd - 1 && rerouted
        }

        this._matrix.setColumns(targetRow, columnState)
      }
    } else {
      // Are we connecting nodes in different columns?
      // I.e. drawing a line that ultimately curves into another column
      // to represent a new branch being created or a branch being merged.
      for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
        const columnState = this._matrix.getColumns(targetRow)

        // We're drawing a merge line from the bottom of
        // a commit node, down, then to the left.
        const edgeDownToLeft = rowEnd > rowStart && colEnd < colStart

        // If we're on the first row (the one with the start node)
        if (targetRow === rowStart) {
          if (edgeDownToLeft) {
            // For the first row, just add a vertical merge line
            // out the bottom of the commit node.
            columnState[colStart] = {
              ...columnState[colStart],
              isVerticalLine: true
            }
          } else {
            // Horizontal straight lines in all but the target column
            // since that one will be a curved line.
            for (let columnIndex = colStart; columnIndex < colEnd; columnIndex++) {
              columnState[columnIndex] = {
                ...columnState[columnIndex],
                isHorizontalLine: true,
                mergeSourceColumns: [
                  ...(columnState[columnIndex]?.mergeSourceColumns ?? []),
                  colEnd
                ]
              }
            }

            // Add in the curved line in the target column where the end node is
            columnState[colEnd] = {
              ...columnState[colEnd],
              isLeftDownCurve: true,
              isBottomBreakPoint: rerouted && targetRow === rowEnd && !this._matrix.hasCommitNodeAt(targetRow + 1, colStart)
            }
          }
        } else if (edgeDownToLeft) {
          // Vertical straight lines down up until
          // before we reach the target row since we'll
          // have a curved line their around the corner.
          if (targetRow !== rowStart && targetRow != rowEnd) {
            columnState[colStart] = {
              ...columnState[colStart],
              isVerticalLine: true,
              isBottomBreakPoint: rerouted && targetRow === rowEnd - 1
            }
          }

          if (targetRow === rowEnd) {
            // Add the curved line into the column that we're starting
            // from (the commit nodes), and draw to the left towards our
            // target node.
            columnState[colStart] = {
              ...columnState[colStart],
              isLeftUpCurve: true
            }

            // Since we draw the edges first, we can't check if
            // the column above has a node or not. We can't tell if we
            // need a top break-point yet, so we'll add it to the list
            // to check afterwards.
            if (rerouted) {
              this._columnBreakPointChecks.push({
                location: [targetRow, colStart],
                position: 'top',
                check: () => !this._matrix.hasCommitNodeAt(targetRow - 1, colStart)
              })
            }

            // For the remaining columns in this final row, draw
            // horizontal lines towards the target commit node.
            for (let columnIndex = colStart - 1; columnIndex >= colEnd; columnIndex--) {
              columnState[columnIndex] = {
                ...columnState[columnIndex],
                isHorizontalLine: true,
                mergeSourceColumns: [
                  ...(columnState[columnIndex]?.mergeSourceColumns ?? []),
                  colStart
                ]
              }
            }

            columnState[colEnd] = {
              ...columnState[colEnd]
            }
          }
        } else {
          // Else we're drawing a vertical line
          columnState[colEnd] = {
            ...columnState[colEnd],
            isVerticalLine: true,
            isBottomBreakPoint: rerouted && targetRow === rowEnd - 1
          }
        }

        this._matrix.setColumns(targetRow, columnState)
      }
    }
  }

  public get columnBreakPointChecks() {
    return this._columnBreakPointChecks
  }
}