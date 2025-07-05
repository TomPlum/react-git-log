import { isColumnEmpty } from 'modules/Graph/strategies/Grid/utility/isColumnEmpty'
import { CommitNodeLocation, GraphEdge } from 'data'
import { Commit } from 'types/Commit'
import { GraphMatrixBuilderProps, GraphBreakPointCheck } from './types'
import { GraphEdgeRenderer } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphEdgeRenderer'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'

export class GraphMatrixBuilder {
  // Maps the one-based row index to an array of column state data
  private readonly _matrix: GraphMatrix

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

  private readonly graphEdgeRenderer: GraphEdgeRenderer

  private columnBreakPointChecks: GraphBreakPointCheck[] = []

  constructor(props: GraphMatrixBuilderProps) {
    this.graphWidth = props.graphWidth
    this.commits = props.commits
    this.positions = props.positions
    this.visibleCommits = props.visibleCommits
    this.headCommit = props.headCommit
    this.headCommitHash = props.headCommitHash
    this.isIndexVisible = props.isIndexVisible
    this._matrix = new GraphMatrix(props.graphWidth)
    this.graphEdgeRenderer = new GraphEdgeRenderer(this._matrix)
  }

  public drawEdges(edgeData: GraphEdge[]) {
    edgeData.forEach(({ from, to, rerouted }) => {
      this.graphEdgeRenderer.drawEdge(from, to, rerouted)
    })

    this.columnBreakPointChecks = this.graphEdgeRenderer.columnBreakPointChecks
  }

  public drawNode(position: CommitNodeLocation) {
    const [row, column] = position
    const columnState = this._matrix.getColumns(row)

    const isColumnBelowEmpty = this._matrix.isColumnBelowEmpty(row, column)
    const isColumnAboveBreakPoint = this._matrix.isColumnAboveBreakPoint(row, column)

    columnState.update(column, {
      isNode: true,
      isColumnAboveEmpty: this._matrix.isColumnAboveEmpty(row, column),
      isColumnBelowEmpty,
      isTopBreakPoint: isColumnAboveBreakPoint
    })

    this._matrix.setColumns(row, columnState)
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
    this.columnBreakPointChecks.forEach(({ check, position, location: [rowIndex, columnIndex] }) => {
      const shouldApplyBreakPoint = check(this._matrix)
      if (position === 'bottom') {
        console.log('APPLY BOTTOM CHECK: ', shouldApplyBreakPoint)
      }

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
    if (this.headCommit && this.isIndexVisible && this.positions.has(this.headCommit.hash)) {
      const headCommitRowIndex = this.positions.get(this.headCommit.hash)![0]

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
    const commitsWithUntrackedParents = this.commits.filter(({ parents }) => {
      return parents.some(parentHash => {
        return !this.positions.has(parentHash)
      })
    })

    const drawVerticalLineToBottom = (fromCommitHash: string) => {
      const [rowIndex, columnIndex] = this.positions.get(fromCommitHash)!
      for (let targetRowIndex = rowIndex; targetRowIndex <= this.visibleCommits; targetRowIndex++) {
        const columnState = this._matrix.getColumns(targetRowIndex)

        columnState.update(columnIndex, {
          isVerticalLine: true,
          isColumnBelowEmpty: false
        })

        this._matrix.setColumns(targetRowIndex, columnState)
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
        const columnStates = this._matrix.getColumns(rowIndex)

        // Can we just draw straight down in the current column?
        let columnsBelowContainNode = false
        let targetRowIndex = rowIndex + 1
        while(targetRowIndex <= this.visibleCommits) {
          if (this._matrix.getColumns(targetRowIndex).columns[columnIndex].isNode) {
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
          while(!isColumnEmpty(columnStates.columns[targetColumnIndex])) {
            targetColumnIndex++
          }

          // For all columns in this row up until the target, draw a horizontal line
          for (let colIndex = columnIndex; colIndex < targetColumnIndex; colIndex++) {
            columnStates.update(colIndex, {
              isHorizontalLine: true,
              mergeSourceColumns: [targetColumnIndex]
            })
          }

          // Add the curve at the target index
          columnStates.update(targetColumnIndex, {
            isLeftDownCurve: true,
            mergeSourceColumns: [targetColumnIndex]
          })

          // Finally, add vertical lines from below the curve to the bottom of the graph
          if (rowIndex < this.visibleCommits) {
            for (let targetRowIndex = rowIndex + 1; targetRowIndex <= this.visibleCommits; targetRowIndex++) {
              const targetRowColumnStates = this._matrix.getColumns(targetRowIndex)

              targetRowColumnStates.update(targetColumnIndex, {
                isVerticalLine: true,
                mergeSourceColumns: [targetColumnIndex]
              })

              this._matrix.setColumns(targetRowIndex, targetRowColumnStates)
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

        this._matrix.setColumns(rowIndex, columnStates)
      })

    // Any commits who have child hashes that are not present in the graph and
    // are not the HEAD commit, must have vertical lines drawn from them up to
    // the top row to indicate that the child commit node is before the rows currently shown.
    this.commits.filter(commit => {
      return commit.children.length === 0 && commit.hash !== this.headCommitHash
    }).forEach(commitWithNoChildren => {
      const [rowIndex, columnIndex] = this.positions.get(commitWithNoChildren.hash)!
      for (let targetRowIndex = rowIndex; targetRowIndex >= 1; targetRowIndex--) {
        const columnState = this._matrix.getColumns(targetRowIndex)

        columnState.update(columnIndex, {
          isVerticalLine: true,
          isColumnAboveEmpty: false
        })

        this._matrix.setColumns(targetRowIndex, columnState)
      }
    })
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
    return this._virtualColumns
  }
}