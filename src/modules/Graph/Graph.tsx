import { useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useGitContext } from 'modules/Visualiser/context'
import { IndexPseudoNode } from 'modules/Graph/components/IndexPseudoNode'

export const Graph = () => {
  const { graphData: { graphWidth, positions, edges, commits }, headCommit } = useGitContext()

  const columnData = useMemo(() => {
    // Maps the one-based row index to an array of column state data
    const rowToColumnState = new Map<number, GraphColumnState[]>()

    // An iterable array of tuples containing commit node row and column indices
    const commitNodePositions = Array.from(positions.values())

    // Iterate over all the edges update the graph column state
    // for each of the respective branch/merge line segments.
    edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], type]) => {
      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      if (colStart === colEnd) {
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const newColumnState: GraphColumnState[] = new Array(graphWidth).fill({
            isVerticalMergeLine: false
          })

          const columnState = rowToColumnState.get(targetRow) ?? newColumnState

          columnState[colStart] = {
            ...columnState[colStart],
            isVerticalMergeLine: true
          }

          rowToColumnState.set(targetRow, columnState)
        }
      } else {
        // Are we connecting nodes in different columns?
        // I.e. drawing a line that ultimately curves into another column
        // to represent a new branch being created or a branch being merged.
        for (let targetRow = rowStart; targetRow <= rowEnd; targetRow++) {
          const emptyColumnState: GraphColumnState[] = new Array<GraphColumnState>(graphWidth).fill({})
          const columnState = rowToColumnState.get(targetRow) ?? emptyColumnState

          // We're drawing a merge line from the bottom of
          // one node, down, then to the left.
          const edgeDownToLeft = rowEnd > rowStart && colEnd < colStart

          // If we're on the first row (the one with the start node)
          if (targetRow === rowStart) {
            if (edgeDownToLeft) {
              // For the first row, just add a vertical merge line
              // out the bottom of the commit node.
              columnState[colStart] = {
                ...columnState[colStart],
                isVerticalMergeLine: true
              }
            } else {
              // Horizontal straight lines in all but the target column
              // since that one will be a curved line.
              for (let columnIndex = colStart; columnIndex < colEnd; columnIndex++) {
                columnState[columnIndex] = {
                  ...columnState[columnIndex],
                  isHorizontalLine: true
                }
              }

              // Add in the curved line in the target column where the end node is
              columnState[colEnd] = {
                ...columnState[colEnd],
                isLeftDownCurve: true
              }
            }
          } else {
            if (edgeDownToLeft) {
              // Vertical straight lines down up until
              // before we reach the target row since we'll
              // have a curved line their around the corner.
              if (targetRow !== rowStart && targetRow != rowEnd) {
                columnState[colStart] = {
                  ...columnState[colStart],
                  isVerticalMergeLine: true
                }
              }

              if (targetRow === rowEnd) {
                // Add the curved line into the column that we're starting
                // from (the commit nodes), and raw to the left towards our
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
                    isHorizontalLine: true
                  }
                }
              }
            } else {
              // If we're on rows beyond the first one where the start node is,
              // then draw vertical lines down to the end node
              columnState[colEnd] = {
                ...columnState[colEnd],
                isVerticalMergeLine: true
              }
            }
          }

          rowToColumnState.set(targetRow, columnState)
        }
      }

      // TODO: Remove the below once all working
      const fromHash = [...positions.entries()].find((it) => {
        return it[1][0] === rowStart
      })![0]

      const toHash = [...positions.entries()].find((it) => {
        return it[1][0] === rowEnd
      })![0]
      console.log('Row', rowStart, 'Column', colStart, 'hash', fromHash, '-->', 'Row', rowEnd, 'Column', colEnd, 'hash', toHash, ' --- type', type)
    })

    // Add the commit nodes into their respective rows and columns
    commitNodePositions.forEach((position) => {
      const [row, column] = position
      const columnState = rowToColumnState.get(row) ?? new Array<GraphColumnState>(graphWidth).fill({})

      columnState[column] = {
        ...columnState[column],
        isNode: true
      }

      rowToColumnState.set(row, columnState)
    })

    // Add the vertical branch lines in from the current branches
    // HEAD commit up to the index pseudo commit node.
    for (let rowIndex = 0; rowIndex <= positions.get(headCommit.hash)![0]; rowIndex++) {
      const columnState = rowToColumnState.get(rowIndex) ?? new Array<GraphColumnState>(graphWidth).fill({})

      columnState[0] = {
        ...columnState[0],
        isVerticalIndexLine: true
      }
    }

    return rowToColumnState
  }, [positions, edges, commits.length, graphWidth, headCommit.hash])

  return (
    <div
      className={styles.graph}
      style={{
        gridTemplateColumns: `repeat(${graphWidth}, 1fr)`,
        gridTemplateRows: 'repeat(auto-fill, 40px)' // TODO: Source high from a prop once exposed
      }}
    >
      <IndexPseudoNode
        graphWidth={graphWidth}
      />

      {Array.from(commits.values()).map((commit, index) => (
        <GraphRow
          id={index}
          commit={commit}
          key={commit.hash}
          width={graphWidth}
          columns={columnData.get(index + 1) ?? new Array(graphWidth).fill({})}
        />
      ))}
    </div>
  )
}