import { useCallback, useMemo } from 'react'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { useGitContext } from 'context/GitContext'
import { GraphColumnData, GraphColumnDataProps } from './types'
import { isColumnEmpty } from 'modules/Graph/strategies/Grid/utility/isColumnEmpty'
import { getEmptyColumnState as createEmptyColumn } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'
import { CommitNodeLocation } from 'data'

export const useColumnData = ({ visibleCommits }: GraphColumnDataProps): GraphColumnData => {
  const {
    paging,
    filter,
    headCommit,
    headCommitHash,
    isIndexVisible,
    isServerSidePaginated,
    graphData: { graphWidth, positions, edges, commits, filteredData }
  } = useGitContext()

  const getEmptyColumnState = useCallback(() => {
    return createEmptyColumn({ columns: graphWidth })
  }, [graphWidth])

  const { rowToColumnState, virtualColumns } = useMemo(() => {
    // Maps the one-based row index to an array of column state data
    const rowToColumnState = new Map<number, GraphColumnState[]>()

    // If, while server-side paginated, we find commits that need to draw
    // lines to nodes that lie outside of this page of data, and those lines
    // need to be drawn into columns that are beyond the current graph width,
    // then we track the number of new "virtual" columns here that will be injected
    // in the graph.
    let virtualColumns = 0

    const isColumnAboveEmpty = (row: number, column: number) => {
      return rowToColumnState.has(row - 1)
        ? isColumnEmpty(rowToColumnState.get(row - 1)![column])
        : false
    }

    const columnContainsCommitNode = (row: number, column: number) => {
      return rowToColumnState.has(row)
        ? rowToColumnState.get(row)![column].isNode
        : false
    }

    const drawEdges = (edgeData: { from: CommitNodeLocation, to: CommitNodeLocation, rerouted: boolean }[]) => {
      const columnBreakPointChecks: { location: CommitNodeLocation, check: () => boolean, breakPoint: 'top' | 'bottom' }[] = []

      edgeData.forEach(({ from, to, rerouted }) => {
        const [rowStart, colStart] = from
        const [rowEnd, colEnd] = to

        // Are we connecting to nodes in the same column?
        // I.e. drawing a straight merge line between them.
        if (colStart === colEnd) {
          for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
            const columnState = rowToColumnState.get(targetRow) ?? getEmptyColumnState()

            columnState[colStart] = {
              ...columnState[colStart],
              isVerticalLine: true,
              isBottomBreakPoint: targetRow === rowEnd - 1 && rerouted
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
                  isLeftDownCurve: true,
                  isBottomBreakPoint: rerouted && targetRow === rowEnd && !columnContainsCommitNode(targetRow + 1, colStart)
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
                    breakPoint: 'top',
                    check: () => !columnContainsCommitNode(targetRow - 1, colStart)
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

            rowToColumnState.set(targetRow, columnState)
          }
        }
      })

      return { columnBreakPointChecks }
    }

    const drawNode = (position: CommitNodeLocation) => {
      const [row, column] = position
      const columnState = rowToColumnState.get(row) ?? getEmptyColumnState()

      const isColumnBelowEmpty = rowToColumnState.has(row + 1)
        ? isColumnEmpty(rowToColumnState.get(row + 1)![column])
        : false

      const isColumnAboveBreakPoint = rowToColumnState.has(row - 1)
        ? rowToColumnState.get(row - 1)![column].isBottomBreakPoint
        : false

      columnState[column] = {
        ...columnState[column],
        isNode: true,
        isColumnAboveEmpty: isColumnAboveEmpty(row, column),
        isColumnBelowEmpty,
        isTopBreakPoint: isColumnAboveBreakPoint
      }

      rowToColumnState.set(row, columnState)
    }

    if (filter) {
      const { columnBreakPointChecks } = drawEdges(filteredData.edges)

      filteredData.positions.forEach((position) => {
        drawNode(position)
      })

      columnBreakPointChecks.forEach(({ check, breakPoint, location }) => {
        if (breakPoint === 'top') {
          const shouldApplyBreakPoint = check()
          const rowIndex = location[0]

          if (shouldApplyBreakPoint && rowToColumnState.has(rowIndex)) {
            const columnState = rowToColumnState.get(rowIndex)!
            const columnIndex = location[1]

            columnState[columnIndex] = {
              ...columnState[columnIndex],
              isTopBreakPoint: true
            }
          }
        }
      })
    } else {
      // An iterable array of tuples containing commit node row and column indices
      const commitNodePositions = Array.from(positions.values())

      // Iterate over all the edges update the graph column state
      // for each of the respective branch/merge line segments.
      drawEdges(edges.search(0, commits.length).map(([from, to]) => ({
        from,
        to,
        rerouted: false
      })))

      // Add the commit nodes into their respective rows and columns
      commitNodePositions.forEach((position) => {
       drawNode(position)
      })

      // Add the vertical branch lines in from the current branches
      // HEAD commit up to the index pseudo commit node.
      if (headCommit && isIndexVisible) {
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
        // Or we may find they can draw straight down if there is free space below to the bottom.
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

              // If we've had to draw outside the graph, then add enough virtual
              // columns to support the new horizontal -> curve -> vertical merge lines.
              const maxColumnIndex = graphWidth - 1
              if (targetColumnIndex > maxColumnIndex) {
                // Add a virtual column for each horizontal line drawn,
                // plus the column with the curve and vertical lines
                virtualColumns = targetColumnIndex - maxColumnIndex
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
    }

    return {
      rowToColumnState,
      virtualColumns
    }
  }, [filter, getEmptyColumnState, filteredData.positions, filteredData.edges, positions, edges, commits, headCommit, isIndexVisible, isServerSidePaginated, paging, visibleCommits, graphWidth, headCommitHash])

  return {
    getEmptyColumnState,
    columnData: rowToColumnState,
    virtualColumns
  }
}