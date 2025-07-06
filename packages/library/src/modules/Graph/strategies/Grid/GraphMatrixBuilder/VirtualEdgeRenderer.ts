import { isColumnEmpty } from 'modules/Graph/strategies/Grid/utility/isColumnEmpty'
import { Commit } from 'types/Commit'
import { CommitNodeLocation } from 'data'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'
import { GraphMatrixColumns } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrixColumns'

export interface VirtualEdgeRendererProps {
  matrix: GraphMatrix
  commits: Commit[]
  visibleCommits: number
  graphWidth: number
  headCommitHash: string | undefined
  positions: Map<string, CommitNodeLocation>
}

export class VirtualEdgeRenderer {
  private readonly _matrix: GraphMatrix
  private readonly _commits: Commit[]
  private readonly _visibleCommits: number
  private readonly _graphWidth: number
  private readonly _headCommitHash: string | undefined
  private readonly _positions: Map<string, CommitNodeLocation>
  private readonly _commitsWithUntrackedParents: Commit[]

  // If, while server-side paginated, we find commits that need to draw
  // lines to nodes that lie outside of this page of data, and those lines
  // need to be drawn into columns that are beyond the current graph width,
  // then we track the number of new "virtual" columns here that will be injected
  // in the graph.
  private _virtualColumns = 0

  constructor(props: VirtualEdgeRendererProps) {
    this._matrix = props.matrix
    this._commits = props.commits
    this._visibleCommits = props.visibleCommits
    this._positions = props.positions
    this._graphWidth = props.graphWidth
    this._headCommitHash = props.headCommitHash

    this._commitsWithUntrackedParents = props.commits.filter(({ parents }) => {
      return parents.some(parentHash => {
        return !props.positions.has(parentHash)
      })
    })
  }

  public draw() {
    // Non-merge commits we can just draw straight down to the edge of the graph
    this._commitsWithUntrackedParents.filter(commit => commit.parents.length === 1).forEach(orphan => {
      this.drawVerticalLineToBottom(orphan.hash)
    })

    // Merge commits may have lines coming out horizontally and then down to the bottom.
    // Or we may find they can draw straight down if there is free space below to the bottom.
    this._commitsWithUntrackedParents
      .filter(({ parents }) => parents.length > 1)
      .sort((a, b) => this._positions.get(a.hash)![0] < this._positions.get(b.hash)![0] ? -1 : 1)
      .forEach(({ hash }) => {
        this.drawDownwardEdgesFromOrphanedMergeCommit(hash)
      })

    // Any commits who have child hashes that are not present in the graph and
    // are not the HEAD commit, must have vertical lines drawn from them up to
    // the top row to indicate that the child commit node is before the rows currently shown.
    this._commits.filter(commit => {
      const hasNoChildren = commit.children.length === 0
      const isNotHeadCommit = commit.hash !== this._headCommitHash
      return hasNoChildren && isNotHeadCommit
    }).forEach(commitWithNoChildren => {
      const [rowIndex, columnIndex] = this._positions.get(commitWithNoChildren.hash)!
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

  public get virtualColumns() {
    return this._virtualColumns
  }

  private drawDownwardEdgesFromOrphanedMergeCommit(orphanCommitHash: string) {
    const [rowIndex, columnIndex] = this._positions.get(orphanCommitHash)!
    const columns = this._matrix.getColumns(rowIndex)

    // Can we just draw straight down in the current column?
    let columnsBelowContainNode = false
    let targetRowIndex = rowIndex + 1
    while(targetRowIndex <= this._visibleCommits) {
      if (this._matrix.getColumns(targetRowIndex).columns[columnIndex].isNode) {
        columnsBelowContainNode = true
      }
      targetRowIndex++
    }

    if (!columnsBelowContainNode && rowIndex !== this._visibleCommits) {
      this.drawVerticalLineToBottom(orphanCommitHash)
    } else {
      // If not, we'll have to find a column to the side
      let targetColumnIndex = columnIndex

      // Find the nearest column to the right that is empty
      while(!isColumnEmpty(columns.columns[targetColumnIndex])) {
        targetColumnIndex++
      }

      // For all columns in this row up until the target, draw a horizontal line
      this.drawHorizontalLine(columns, columnIndex, targetColumnIndex)

      // Add the curve at the target index
      columns.update(targetColumnIndex, {
        isLeftDownCurve: true,
        mergeSourceColumns: [targetColumnIndex]
      })

      // Finally, add vertical lines from below the curve to the bottom of the graph
      if (rowIndex < this._visibleCommits) {
        for (let targetRowIndex = rowIndex + 1; targetRowIndex <= this._visibleCommits; targetRowIndex++) {
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
      const maxColumnIndex = this._graphWidth - 1
      if (targetColumnIndex > maxColumnIndex) {
        // Add a virtual column for each horizontal line drawn,
        // plus the column with the curve and vertical lines
        this._virtualColumns = targetColumnIndex - maxColumnIndex
      }
    }

    this._matrix.setColumns(rowIndex, columns)
  }

  private drawVerticalLineToBottom(fromCommitHash: string) {
    const [rowIndex, columnIndex] = this._positions.get(fromCommitHash)!
    for (let targetRowIndex = rowIndex; targetRowIndex <= this._visibleCommits; targetRowIndex++) {
      const columnState = this._matrix.getColumns(targetRowIndex)

      columnState.update(columnIndex, {
        isVerticalLine: true,
        isColumnBelowEmpty: false
      })

      this._matrix.setColumns(targetRowIndex, columnState)
    }
  }

  private drawHorizontalLine(columns: GraphMatrixColumns, sourceColumn: number, targetColumn: number) {
    for (let colIndex = sourceColumn; colIndex < targetColumn; colIndex++) {
      columns.update(colIndex, {
        isHorizontalLine: true,
        mergeSourceColumns: [targetColumn]
      })
    }
  }
}