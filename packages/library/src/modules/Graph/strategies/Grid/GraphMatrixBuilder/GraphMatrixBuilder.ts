import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { isColumnEmpty } from 'modules/Graph/strategies/Grid/utility/isColumnEmpty'
import { CommitNodeLocation, GraphEdge } from 'data'
import { getEmptyColumnState } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'
import { Commit } from 'types/Commit'
import { GraphMatrixBuilderProps, GraphBreakPointCheck } from './types'

export class GraphMatrixBuilder {
  // Maps the one-based row index to an array of column state data
  private readonly _matrix = new Map<number, GraphColumnState[]>()

  // If, while server-side paginated, we find commits that need to draw
  // lines to nodes that lie outside of this page of data, and those lines
  // need to be drawn into columns that are beyond the current graph width,
  // then we track the number of new "virtual" columns here that will be injected
  // in the graph.
  private _virtualColumns = 0

  private readonly graphWidth: number
  private readonly commits: Commit[]
  private readonly positions: Map<string, CommitNodeLocation>
  private readonly visibleCommits: number
  private readonly headCommit: Commit | undefined
  private readonly headCommitHash: string | undefined
  private readonly isIndexVisible: boolean

  private columnBreakPointChecks: GraphBreakPointCheck[] | undefined

  constructor(props: GraphMatrixBuilderProps) {
    this.graphWidth = props.graphWidth
    this.commits = props.commits
    this.positions = props.positions
    this.visibleCommits = props.visibleCommits
    this.headCommit = props.headCommit
    this.headCommitHash = props.headCommitHash
    this.isIndexVisible = props.isIndexVisible
  }

  public drawEdges(edgeData: GraphEdge[]) {
    const columnBreakPointChecks: GraphBreakPointCheck[] = []

    edgeData.forEach(({ from, to, rerouted }) => {
      const [rowStart, colStart] = from
      const [rowEnd, colEnd] = to

      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      if (colStart === colEnd) {
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const columnState = this._matrix.get(targetRow) ?? this.emptyColumnState()

          columnState[colStart] = {
            ...columnState[colStart],
            isVerticalLine: true,
            isBottomBreakPoint: targetRow === rowEnd - 1 && rerouted
          }

          this._matrix.set(targetRow, columnState)
        }
      } else {
        // Are we connecting nodes in different columns?
        // I.e. drawing a line that ultimately curves into another column
        // to represent a new branch being created or a branch being merged.
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const columnState = this._matrix.get(targetRow) ?? this.emptyColumnState()

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
                isBottomBreakPoint: rerouted && targetRow === rowEnd && !this.columnContainsCommitNode(targetRow + 1, colStart)
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
                columnBreakPointChecks.push({
                  location: [targetRow, colStart],
                  position: 'top',
                  check: () => !this.columnContainsCommitNode(targetRow - 1, colStart)
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

          this._matrix.set(targetRow, columnState)
        }
      }
    })

    this.columnBreakPointChecks = columnBreakPointChecks
  }

  public drawNode(position: CommitNodeLocation) {
    const [row, column] = position
    const columnState = this._matrix.get(row) ?? this.emptyColumnState()

    const isColumnBelowEmpty = this._matrix.has(row + 1)
      ? isColumnEmpty(this._matrix.get(row + 1)![column])
      : false

    const isColumnAboveBreakPoint = this._matrix.has(row - 1)
      ? this._matrix.get(row - 1)![column].isBottomBreakPoint
      : false

    columnState[column] = {
      ...columnState[column],
      isNode: true,
      isColumnAboveEmpty: this.isColumnAboveEmpty(row, column),
      isColumnBelowEmpty,
      isTopBreakPoint: isColumnAboveBreakPoint
    }

    this._matrix.set(row, columnState)
  }

  /**
   * Updates the matrix to mark certain columns has having
   * break-points after the first node and edge render phases.
   *
   * Such checks are only possible after the initial phases
   * since we need to know about the positions of all the nodes
   * and their edges after applying pagination and filtering.
   */
  public checkPostRenderBreakPoints() {
    this.columnBreakPointChecks?.forEach(({ check, position, location }) => {
      if (position === 'top') {
        const shouldApplyBreakPoint = check()
        const rowIndex = location[0]

        if (shouldApplyBreakPoint && this._matrix.has(rowIndex)) {
          const columnState = this._matrix.get(rowIndex)!
          const columnIndex = location[1]

          columnState[columnIndex] = {
            ...columnState[columnIndex],
            isTopBreakPoint: true
          }
        }
      }
    })
  }

  /**
   * Adds the vertical branch lines in from the current branches
   * HEAD commit up to the index pseudo commit node.
   */
  public drawIndexPseudoCommitEdge() {
    if (this.headCommit && this.isIndexVisible && this.positions.has(this.headCommit.hash)) {
      const headCommitRowIndex = this.positions.get(this.headCommit.hash)![0]

      for (let rowIndex = 0; rowIndex <= headCommitRowIndex; rowIndex++) {
        const columnState = this._matrix.get(rowIndex) ?? this.emptyColumnState()

        columnState[0] = {
          ...columnState[0],
          isVerticalLine: true,
          isVerticalIndexLine: true
        }
      }
    }
  }

  /**
   * Any commits who have parent hashes that are not present in the graph
   * must have vertical lines drawn from them down to the bottom row to indicate
   * that the parent commit node lies beyond the rows currently shown.
   */
  public drawOffPageVirtualEdges() {
    const commitsWithUntrackedParents = this.commits.filter(({ parents }) => {
      return parents.some(parentHash => {
        return !this.positions.has(parentHash)
      })
    })

    const drawVerticalLineToBottom = (fromCommitHash: string) => {
      const [rowIndex, columnIndex] = this.positions.get(fromCommitHash)!
      for (let targetRowIndex = rowIndex; targetRowIndex <= this.visibleCommits; targetRowIndex++) {
        const columnState = this._matrix.get(targetRowIndex) ?? this.emptyColumnState()

        columnState[columnIndex] = {
          ...columnState[columnIndex],
          isVerticalLine: true,
          isColumnBelowEmpty: false
        }

        this._matrix.set(targetRowIndex, columnState)
      }
    }

    // Non-merge commits we can just draw straight down to the edge of the graph
    commitsWithUntrackedParents.filter(commit => commit.parents.length === 1).forEach(orphan => {
      drawVerticalLineToBottom(orphan.hash)
    })

    // Merge commits may have lines coming out horizontally and then down to the bottom.
    // Or we may find they can draw straight down if there is free space below to the bottom.
    commitsWithUntrackedParents
      .filter(commit => commit.parents.length > 1)
      .sort((a, b) => this.positions.get(a.hash)![0] < this.positions.get(b.hash)![0] ? -1 : 1)
      .forEach(orphan => {
        const [rowIndex, columnIndex] = this.positions.get(orphan.hash)!
        const columnStates = this._matrix.get(rowIndex) ?? this.emptyColumnState()

        // Can we just draw straight down in the current column?
        let columnsBelowContainNode = false
        let targetRowIndex = rowIndex + 1
        while(targetRowIndex <= this.visibleCommits) {
          if (this._matrix.get(targetRowIndex)![columnIndex].isNode) {
            columnsBelowContainNode = true
          }
          targetRowIndex++
        }

        if (!columnsBelowContainNode && rowIndex != this.visibleCommits) {
          drawVerticalLineToBottom(orphan.hash)
        } else {
          // If not, we'll have to find a column to the side
          let targetColumnIndex = columnIndex

          // Find the nearest column to the right that is empty
          while(!isColumnEmpty(columnStates[targetColumnIndex])) {
            targetColumnIndex++
          }

          // For all columns in this row up until the target, draw a horizontal line
          for (let colIndex = columnIndex; colIndex < targetColumnIndex; colIndex++) {
            columnStates[colIndex] = {
              ...columnStates[colIndex],
              isHorizontalLine: true,
              mergeSourceColumns: [targetColumnIndex]
            }
          }

          // Add the curve at the target index
          columnStates[targetColumnIndex] = {
            ...columnStates[targetColumnIndex],
            isLeftDownCurve: true,
            mergeSourceColumns: [targetColumnIndex]
          }

          // Finally, add vertical lines from below the curve to the bottom of the graph
          if (rowIndex < this.visibleCommits) {
            for (let targetRowIndex = rowIndex + 1; targetRowIndex <= this.visibleCommits; targetRowIndex++) {
              const targetRowColumnStates = this._matrix.get(targetRowIndex) ?? this.emptyColumnState()

              targetRowColumnStates[targetColumnIndex] = {
                ...targetRowColumnStates[targetColumnIndex],
                isVerticalLine: true,
                mergeSourceColumns: [targetColumnIndex]
              }

              this._matrix.set(targetRowIndex, targetRowColumnStates)
            }
          }

          // If we've had to draw outside the graph, then add enough virtual
          // columns to support the new horizontal -> curve -> vertical merge lines.
          const maxColumnIndex = this.graphWidth - 1
          if (targetColumnIndex > maxColumnIndex) {
            // Add a virtual column for each horizontal line drawn,
            // plus the column with the curve and vertical lines
            this._virtualColumns = targetColumnIndex - maxColumnIndex
          }
        }

        this._matrix.set(rowIndex, columnStates)
      })

    // Any commits who have child hashes that are not present in the graph and
    // are not the HEAD commit, must have vertical lines drawn from them up to
    // the top row to indicate that the child commit node is before the rows currently shown.
    this.commits.filter(commit => {
      return commit.children.length === 0 && commit.hash !== this.headCommitHash
    }).forEach(commitWithNoChildren => {
      const [rowIndex, columnIndex] = this.positions.get(commitWithNoChildren.hash)!
      for (let targetRowIndex = rowIndex; targetRowIndex >= 1; targetRowIndex--) {
        const columnState = this._matrix.get(targetRowIndex) ?? this.emptyColumnState()

        columnState[columnIndex] = {
          ...columnState[columnIndex],
          isVerticalLine: true,
          isColumnAboveEmpty: false
        }

        this._matrix.set(targetRowIndex, columnState)
      }
    })
  }

  /**
   * Marks the first row so it can render with a gradient.
   */
  public markFirstRow(firstVisibleRowIndex: number) {
    const firstRow = this._matrix.get(firstVisibleRowIndex) ?? this.emptyColumnState()

    for(let firstRowColumn = 0; firstRowColumn < firstRow.length; firstRowColumn++) {
      firstRow[firstRowColumn] = {
        ...firstRow[firstRowColumn],
        isFirstRow: true,
      }
    }

    this._matrix.set(firstVisibleRowIndex, firstRow)
  }

  /**
   * Marks the last row so it can render with a gradient.
   */
  public markLastRow(lastVisibleRowIndex: number) {
    const lastRow = this._matrix.get(lastVisibleRowIndex) ?? this.emptyColumnState()
    for(let lastRowColumn = 0; lastRowColumn < lastRow.length; lastRowColumn++) {
      lastRow[lastRowColumn] = {
        ...lastRow[lastRowColumn],
        isLastRow: true,
      }
    }

    this._matrix.set(lastVisibleRowIndex, lastRow)
  }

  public get matrix() {
    return this._matrix
  }

  public get virtualColumns() {
    return this._virtualColumns
  }

  private emptyColumnState() {
    return getEmptyColumnState({
      columns: this.graphWidth
    })
  }

  private isColumnAboveEmpty(row: number, column: number) {
    return this._matrix.has(row - 1)
      ? isColumnEmpty(this._matrix.get(row - 1)![column])
      : false
  }

  private columnContainsCommitNode(row: number, column: number) {
    return this._matrix.has(row)
      ? this._matrix.get(row)![column].isNode
      : false
  }
}