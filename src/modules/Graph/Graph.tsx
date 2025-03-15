import { useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useGitContext } from 'modules/Visualiser/context'

export const Graph = () => {
  const { graphData: { graphWidth, positions, edges, commits } } = useGitContext()

  // console.log('graph positions', positions)
  // console.log('graph width', width)
  // console.log('graph edges', edges)

  const columnData = useMemo(() => {
    const rowToColumnState = new Map<number, GraphColumnState[]>()
    const commitNodePositions = Array.from(positions.values())

    edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], type]) => {
      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      if (colStart === colEnd) {
        for (let targetRow = rowStart - 1; targetRow <= rowEnd - 1; targetRow++) {
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
        // I.e. drawing a line that ultimately curves into another column.
        for (let targetRow = rowStart - 1; targetRow <= rowEnd - 1; targetRow++) {
          const newColumnState: GraphColumnState[] = new Array<GraphColumnState>(graphWidth).fill({})

          const columnState = rowToColumnState.get(targetRow) ?? newColumnState

          // If we're on the first row (the one with the start node)
          // Then we draw a horizontal line across the row to the target
          // column of the end node
          if (targetRow === rowStart - 1) {
            // Straight lines in all but the target column
            // since that one will be a curved line
            for (let columnIndex = colStart; columnIndex < colEnd - 1; columnIndex++) {
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
          } else {
            // If we're on rows beyond the first one where the start node is,
            // then draw vertical lines down to the end node
            columnState[colEnd] = {
              ...columnState[colEnd],
              isVerticalMergeLine: true
            }
          }

          rowToColumnState.set(targetRow, columnState)
        }
      }

      commitNodePositions.forEach((position) => {
        const [row, column] = position
        const columnState = rowToColumnState.get(row) ?? new Array<GraphColumnState>(graphWidth).fill({})

        columnState[column] = {
          ...columnState[column],
          isNode: true
        }
        rowToColumnState.set(row, columnState)
      })

      console.log('Row', rowStart, 'Column', colStart, '-->', 'Row', rowEnd, 'Column', colEnd, 'type', type)
    })

    return rowToColumnState
  }, [positions, edges, commits.length, graphWidth])

  const indexColumns = new Array<GraphColumnState>(graphWidth).fill({})
  indexColumns[0] = {
    isNode: true,
    isVerticalMergeLine: true
  }

  return (
    <div
      className={styles.graph}
      style={{
        gridTemplateColumns: `repeat(${graphWidth}, 1fr)`
      }}
    >
      <GraphRow
        id={-1}
        key={'index'}
        width={graphWidth}
        columns={indexColumns}
      />

      {Array.from(commits.values()).map((commit, index) => (
        <GraphRow
          id={index}
          key={commit.hash}
          width={graphWidth}
          commit={commit}
          columns={columnData.get(index + 1) ?? new Array(graphWidth).fill({})}
        />
      ))}
    </div>
  )
}