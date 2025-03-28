import { useCallback, useMemo } from 'react'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useGitContext } from 'context/GitContext'
import { GraphColumnData, GraphColumnDataProps } from './types'
import { isColumnEmpty } from 'modules/Graph/utility/isColumnEmpty'

export const useColumnData = ({ visibleCommits }: GraphColumnDataProps): GraphColumnData => {
  const {
    paging,
    headCommit,
    headCommitHash,
    isServerSidePaginated,
    graphData: { graphWidth, positions, edges, commits }
  } = useGitContext()

  const getEmptyColumnState = useCallback(() => {
    return new Array<GraphColumnState>(graphWidth).fill({})
  }, [graphWidth])

  const columnData = useMemo(() => {
    // Maps the one-based row index to an array of column state data
    const rowToColumnState = new Map<number, GraphColumnState[]>()

    // An iterable array of tuples containing commit node row and column indices
    const commitNodePositions = Array.from(positions.values())

    // Iterate over all the edges update the graph column state
    // for each of the respective branch/merge line segments.
    edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd]]) => {
      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      if (colStart === colEnd) {
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const columnState = rowToColumnState.get(targetRow) ?? getEmptyColumnState()

          columnState[colStart] = {
            ...columnState[colStart],
            isVerticalLine: true
          }

          rowToColumnState.set(targetRow, columnState)
        }
      } else {
        // Are we connecting nodes in different columns?
        // I.e. drawing a line that ultimately curves into another column
        // to represent a new branch being created or a branch being merged.
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const columnState = rowToColumnState.get(targetRow) ?? getEmptyColumnState()

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
                isLeftDownCurve: true
              }
            }
          } else {
            // If we're on rows beyond the first one where the start node is

            if (edgeDownToLeft) {
              // Vertical straight lines down up until
              // before we reach the target row since we'll
              // have a curved line their around the corner.
              if (targetRow !== rowStart && targetRow != rowEnd) {
                columnState[colStart] = {
                  ...columnState[colStart],
                  isVerticalLine: true
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
                isVerticalLine: true
              }
            }
          }

          rowToColumnState.set(targetRow, columnState)
        }
      }
    })

    // Add the commit nodes into their respective rows and columns
    commitNodePositions.forEach((position) => {
      const [row, column] = position
      const columnState = rowToColumnState.get(row) ?? getEmptyColumnState()

      const isColumnAboveEmpty = rowToColumnState.has(row - 1)
        ? isColumnEmpty(rowToColumnState.get(row - 1)![column])
        : false

      const isColumnBelowEmpty = rowToColumnState.has(row + 1)
        ? isColumnEmpty(rowToColumnState.get(row + 1)![column])
        : false

      columnState[column] = {
        ...columnState[column],
        isNode: true,
        isColumnAboveEmpty,
        isColumnBelowEmpty
      }

      rowToColumnState.set(row, columnState)
    })

    // Add the vertical branch lines in from the current branches
    // HEAD commit up to the index pseudo commit node.
    if (headCommit) {
      const headCommitRowIndex = positions.get(headCommit.hash)![0]
      for (let rowIndex = 0; rowIndex <= headCommitRowIndex; rowIndex++) {
        const columnState = rowToColumnState.get(rowIndex) ?? getEmptyColumnState()

        columnState[0] = {
          ...columnState[0],
          isVerticalLine: true,
          isVerticalIndexLine: true
        }
      }
    }

    if (isServerSidePaginated) {
      // Any commits who have parent hashes that are not present in the graph
      // must have vertical lines drawn from them down to the bottom row to indicate
      // that the parent commit node lies beyond the rows currently shown.
      const commitsWithUntrackedParents = commits.filter(({ parents }) => {
        return parents.some(parentHash => {
          return !positions.has(parentHash)
        })
      })

      const drawVerticalLineToBottom = (fromCommitHash: string) => {
        const [rowIndex, columnIndex] = positions.get(fromCommitHash)!
        for (let targetRowIndex = rowIndex; targetRowIndex <= visibleCommits; targetRowIndex++) {
          const columnState = rowToColumnState.get(targetRowIndex) ?? getEmptyColumnState()

          columnState[columnIndex] = {
            ...columnState[columnIndex],
            isVerticalLine: true,
            isColumnBelowEmpty: false
          }

          rowToColumnState.set(targetRowIndex, columnState)
        }
      }

      // Non-merge commits we can just draw straight down to the edge of the graph
      commitsWithUntrackedParents.filter(commit => commit.parents.length === 1).forEach(orphan => {
        drawVerticalLineToBottom(orphan.hash)
      })

      // Merge commits may have lines coming out horizontally and then down to the bottom.
      // Or they may find they can draw straight down if there is free space
      commitsWithUntrackedParents
        .filter(commit => commit.parents.length > 1)
        .sort((a, b) => positions.get(a.hash)![0] < positions.get(b.hash)![0] ? -1 : 1)
        .forEach(orphan => {
          const [rowIndex, columnIndex] = positions.get(orphan.hash)!
          const columnStates = rowToColumnState.get(rowIndex) ?? getEmptyColumnState()

          // Can we just draw straight down in the current column?
          let columnsBelowContainNode = false
          let targetRowIndex = rowIndex + 1
          while(targetRowIndex <= visibleCommits) {
            if (rowToColumnState.get(targetRowIndex)![columnIndex].isNode) {
              columnsBelowContainNode = true
            }
            targetRowIndex++
          }

          if (!columnsBelowContainNode && rowIndex != visibleCommits) {
            drawVerticalLineToBottom(orphan.hash)
          } else {
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
            if (rowIndex < visibleCommits) {
              for (let targetRowIndex = rowIndex + 1; targetRowIndex <= visibleCommits; targetRowIndex++) {
                const targetRowColumnStates = rowToColumnState.get(targetRowIndex) ?? getEmptyColumnState()

                targetRowColumnStates[targetColumnIndex] = {
                  ...targetRowColumnStates[targetColumnIndex],
                  isVerticalLine: true,
                  mergeSourceColumns: [targetColumnIndex]
                }

                rowToColumnState.set(targetRowIndex, targetRowColumnStates)
              }
            }
          }

          rowToColumnState.set(rowIndex, columnStates)
        })

      // Any commits who have child hashes that are not present in the graph and
      // are not the HEAD commit, must have vertical lines drawn from them up to
      // the top row to indicate that the child commit node is before the rows currently shown.
      commits.filter(commit => {
        return commit.children.length === 0 && commit.hash !== headCommitHash
      }).forEach(commitWithNoChildren => {
        const [rowIndex, columnIndex] = positions.get(commitWithNoChildren.hash)!
        for (let targetRowIndex = rowIndex; targetRowIndex >= 1; targetRowIndex--) {
          const columnState = rowToColumnState.get(targetRowIndex) ?? getEmptyColumnState()

          columnState[columnIndex] = {
            ...columnState[columnIndex],
            isVerticalLine: true,
            isColumnAboveEmpty: false
          }

          rowToColumnState.set(targetRowIndex, columnState)
        }
      })
    }

    // The first row is told that its first so it can render with a gradient
    const firstVisibleRowIndex = paging ? paging.startIndex + 1 : 1
    const firstRow = rowToColumnState.get(firstVisibleRowIndex) ?? getEmptyColumnState()
    for(let firstRowColumn = 0; firstRowColumn < firstRow.length; firstRowColumn++) {
      firstRow[firstRowColumn] = {
        ...firstRow[firstRowColumn],
        isFirstRow: true,
      }
    }
    rowToColumnState.set(firstVisibleRowIndex, firstRow)

    // The last row is told that its last so it can render with a gradient
    const lastVisibleRowIndex = paging ? paging.endIndex : visibleCommits
    const lastRow = rowToColumnState.get(lastVisibleRowIndex) ?? getEmptyColumnState()
    for(let lastRowColumn = 0; lastRowColumn < lastRow.length; lastRowColumn++) {
      lastRow[lastRowColumn] = {
        ...lastRow[lastRowColumn],
        isLastRow: true,
      }
    }
    rowToColumnState.set(lastVisibleRowIndex, lastRow)

    return rowToColumnState
  }, [positions, edges, commits, headCommit, isServerSidePaginated, paging, getEmptyColumnState, visibleCommits, headCommitHash])

  return {
    getEmptyColumnState,
    columnData
  }
}