import { useCallback, useMemo } from 'react'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useGitContext } from 'context/GitContext'
import { GraphColumnData } from './types'

export const useColumnData = (): GraphColumnData => {
  const {
    headCommit,
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

      // TODO: Remove the below once all working
      /*const fromHash = [...positions.entries()].find((it) => {
        return it[1][0] === rowStart
      })![0]

      const toHash = [...positions.entries()].find((it) => {
        return it[1][0] === rowEnd
      })![0]
      console.log('Row', rowStart, 'Column', colStart, 'hash', fromHash, '-->', 'Row', rowEnd, 'Column', colEnd, 'hash', toHash, ' --- type', type)*/
    })

    // Add the commit nodes into their respective rows and columns
    commitNodePositions.forEach((position) => {
      const [row, column] = position
      const columnState = rowToColumnState.get(row) ?? getEmptyColumnState()

      const isColumnAboveEmpty = rowToColumnState.has(row - 1)
        ? Object.values(rowToColumnState.get(row - 1)![column]).every(value => !value)
        : false

      const isColumnBelowEmpty = rowToColumnState.has(row + 1)
        ? Object.values(rowToColumnState.get(row + 1)![column]).every(value => !value)
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
    const headCommitRowIndex = positions.get(headCommit.hash)![0]
    for (let rowIndex = 0; rowIndex <= headCommitRowIndex; rowIndex++) {
      const columnState = rowToColumnState.get(rowIndex) ?? getEmptyColumnState()

      columnState[0] = {
        ...columnState[0],
        isVerticalLine: true,
        isVerticalIndexLine: true
      }
    }

    return rowToColumnState
  }, [positions, edges, commits.length, getEmptyColumnState, headCommit.hash])

  return {
    getEmptyColumnState,
    columnData
  }
}